
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var kid = require('child_process');
var fansi = require('public/javascripts/fansi');
var s = require('public/javascripts/s');
var io = require('socket.io');
var _ = require('underscore');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('terminal', {
    title: 'Express'
  });
  
});

var tail_f = function(client, file) {
    var proc = kid.spawn('tail', ['-f', file]);
    var machine = new fansi.Machine();

    _(['raw_text', 'cursor_position', 'cursor_down','cursor_forward']).each(
        function(event) {
            var fqe = fansi.event[event];
            var context = {event:fqe};
            
            var trap = function(data) {
                //s.debug_inspect(JSON.stringify({event:this.event, data:data}));
                client.send(JSON.stringify({event:this.event, data:data}));
            };
            
            machine.on(fqe, _.bind(trap, context));
        });


    proc.stdout.on('data',
        function(data) {
            machine.read(data.toString());
        });

    proc.stderr.on('data',function(data) {s.debug_inspect({alas:data.toString()});});
    proc.on('exit', function(code) { s.debug_inspect({horatio:code}); });
};

var run_top = function(client) {
    var machine = new fansi.Machine();

    _(['raw_text', 'cursor_position', 'cursor_down','cursor_forward']).each(
        function(event) {
            var fqe = fansi.event[event];
            var context = {event:fqe};
            
            var trap = function(data) {
                s.debug_inspect(JSON.stringify({event:this.event, data:data}));
                client.send(JSON.stringify({event:this.event, data:data}));
            };
            
            machine.on(fqe, _.bind(trap, context));
        });

    // '/usr/bin/top'
    var proc = kid.spawn('zsh');
    s.debug_inspect({proc:proc, pid:proc.pid});

    proc.stdout.on('data',
        function(data) {
            s.debug_inspect({msg:'cool, data!', datums:data.toString(), proc:proc});
            machine.read(data.toString());
    });
    proc.stderr.on('data',function(data) {s.debug_inspect({alas:data.toString()});});
    proc.on('exit', function(code) { s.debug_inspect({horatio:code}); });

    proc.stdin.write('env\n');
    proc.stdin.write('/usr/bin/top\n');
};

var socket = io.listen(app); // {transports:['websocket']});

socket.on('connection',
    function(client) {
        // run_top(client, '/tmp/top.out');
        tail_f(client, '/tmp/top.out');
    }
);

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
