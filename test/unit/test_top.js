var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    toolbox = require('../../public/javascripts/toolbox'),
    fansi = require('../../public/javascripts/fansi'),
    fs = require('fs'),
    Set = require('set'),
    s = require('../../public/javascripts/s');

var suite = vows.describe('test_top');

var expected_results = [
    fansi.event.setspecg1,                      undefined,
    fansi.event.unknown7,                       '7',
    fansi.event.terminal_config_enable,         47,
    fansi.event.screen_scroll_enable,           [1, 27],
    fansi.event.select_graphic_rendition,       0,
    fansi.event.terminal_config_disable,        4,
    fansi.event.terminal_config_enable,         1,
    fansi.event.set_alternate_keypad_mode,      undefined,
    fansi.event.cursor_position,                [1, 1],
    fansi.event.erase_data,                     2
];

var expected_events = [], expected_messages = [];
var pairs = toolbox.partition(2, expected_results);
// I freaking love underscore
expected_events = _.map(pairs, _.first);
expected_messages = _.map(pairs, _.last);

var do_stuff = function(callback, file) { 
    var machine = new fansi.Machine();

    var actual_events = [], actual_messages = [];
    var callbacks = [];

    // s.debug_inspect({exp_events: expected_events, exp_msgs: expected_messages});

    _.each(Set.unique(expected_events),
        function(msg) {
            var sink = function(data) {
                // s.debug_inspect({me:this, data:data});

                actual_events.push(this.message);
                if (data.length > 1) {
                    actual_messages.push(data);
                } else {
                    actual_messages.push(data[0]);
                }
                
                // s.debug_inspect({act_events: actual_events, act_msgs: actual_messages});
                
                if (actual_events.length == expected_events.length) {
                    // s.debug_inspect({act_events: actual_events, act_msgs: actual_messages});
                    callback(null, [actual_events, actual_messages]);
                }
            };

            var handler = {
                message:msg,
                sink:sink
            };

            machine.on(handler.message, _.bind(handler.sink, handler));
        }
    );

    // start reading the data
    var go_time = function(err, data) {
        if (err) {
            callback(err, null);
        } else { 
            machine.read(data.toString());
        }
    };
    fs.readFile(file, go_time);
};

var batch = {
    topic: function() { do_stuff(this.callback, 'test/data/top.raw'); },
    'got events': function(err, val) {
        if (err) {
            s.debug_inspect({err: err});
        }
        s.noisy_verify(val[0], expected_events);
    },
    'got messages': function(err, val) {
        if (err) {
            s.debug_inspect({err: err});
        }
        s.noisy_verify(val[1], expected_messages);
    }
}

suite.addBatch({'a thing': batch});




suite.export(module);
