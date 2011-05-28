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
    fansi.event.erase_data,                     2,
    fansi.event.raw_text,                       'Processes: 58 total, 4 running, 54 sleeping, 289 threads',
    fansi.event.cursor_position,                [1,66],
    fansi.event.raw_text,                       '05:47:52\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'Load Avg: 0.50, 0.37, 0.32\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'CPU usage: 16.66% user, 50.0% sys, 33.33% idle\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'SharedLibs: 6924K resident, 6688K data, 0B linkedit.\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'MemRegions: 8618 total, 828M resident, 20M private, 289M shared.\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'PhysMem: 674M wired, 1164M active, 511M inactive, 2349M used, 1747M free.\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'VM: 128G vsize, 1042M framework vsize, 2451749(0) pageins, 182(0) pageouts',
    fansi.event.cursor_position,                [8,1],
    fansi.event.raw_text,                       'Networks: packets: 911737/825M in, 619037/109M out.\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       'Disks: 4193121/8413M read, 1082188/13G written.\r',
    fansi.event.cursor_down,                    2,
    fansi.event.raw_text,                       'PID    COMMAND',
    fansi.event.cursor_forward,                 6,
    fansi.event.raw_text,                       '%CPU TIME     #TH  #WQ  #PORT #MRE RPRVT  RSHRD\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '77100  top',
    fansi.event.cursor_position,                [12, 21],
    fansi.event.raw_text,                       '0.0  00:00.03 1/1  0    21+   32+  784K+  336K+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '77094  mdworker     0.0  00:00.10 3    1    48+   64+  2592K+ 15M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '77084- Google Chrom 0.0  00:00.40 5    1    95+   173+ 13M+   81M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '77066- Google Chrom 0.0  00:06.39 3    1    178+  376+ 15M+   99M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76883  zsh',
    fansi.event.cursor_position,                [16, 21],
    fansi.event.raw_text,                       '0.0  00:00.04 1    0    17+   44+  856K+  988K+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76870  zsh',
    fansi.event.cursor_position,                [17, 21],
    fansi.event.raw_text,                       '0.0  00:00.07 1    0    17+   44+  868K+  988K+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76869  login',
    fansi.event.cursor_position,                [18, 21],
    fansi.event.raw_text,                       '0.0  00:00.05 1    0    22+   53+  480K+  312K+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76867  Terminal     0.0  00:02.27 5/1  1    108+  109+ 3364K+ 28M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76836- Google Chrom 0.0  00:02.39 6    2    97+   273+ 24M+   88M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76192  java',
    fansi.event.cursor_position,                [21, 21],
    fansi.event.raw_text,                       '0.0  62:00.95 29   1    505+  828+ 393M+  62M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '76161- Google Chrom 0.0  00:11.51 5    1    96+   235+ 16M+   83M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '75841- Google Chrom 0.0  01:28.35 3    1    107+  161+ 17M+   80M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '75838- Google Chrom 0.0  00:05.64 5    1    96+   198+ 11M+   83M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '75832- Google Chrom 0.0  06:04.24 17   1    1042+ 327+ 91M+   98M+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '70256  Firewall     0.0  00:00.00 1    0    27+   34+  380K+  248K+\r',
    fansi.event.cursor_down,                    1,
    fansi.event.raw_text,                       '29319  activitymoni 0.0  10:12.30 1    0    29+   38+  1152K+ 280K+',
    fansi.event.cursor_position,                [27, 1],
    fansi.event.erase_data,                     2,
    fansi.event.terminal_config_disable,        47,
    '_unknown_8',                               '8',
    fansi.event.raw_text,                       '\r',
    fansi.event.terminal_config_disable,        1,
    '_unknown_>',                               '>'
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
