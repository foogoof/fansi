var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    toolbox = require('../../public/javascripts/toolbox'),
    fansi = require('../../public/javascripts/fansi'),
    fs = require('fs'),
    s = require('../../public/javascripts/s');

var suite = vows.describe('test_top');

var expected_results = [
    fansi.event.setspecg1,                      undefined,
    fansi.event.unknown7,                       '7',
    fansi.event.terminal_config_enable,         [47, 1],
    fansi.event.screen_scroll_enable,           27,
    fansi.event.terminal_config_disable,        0,
    fansi.event.terminal_config_enable,         4,
    fansi.event.set_alternate_keypad_mode,      undefined,
    fansi.event.cursor_position,                [1, 1],
    fansi.event.erase_data,                     2
];

var do_stuff = function(callback, expected_sequence, file) { 
    var expected_events = [], expected_messages = [];
    var ze_callback = callback;

    var machine = new fansi.Machine();

    var actual_events = [], actual_messages = [];
    var callbacks = [];

    var pairs = toolbox.partition(2, expected_sequence);
    // I freaking love underscore
    expected_events = _.map(pairs, _.first);
    expected_messages = _.map(pairs, _.last);

    // s.debug_inspect({exp_events: expected_events, exp_msgs: expected_messages});

    _.each(expected_events,
        function(msg) {
            var sink = function(data) {
                s.debug_inspect({me:this, data:data});

                actual_events.push(this.message);
                actual_messages.push(data);
                
                // s.debug_inspect({act_events: actual_events, act_msgs: actual_messages});
                
                if (actual_events.length == expected_events.length) {
                    s.debug_inspect({act_events: actual_events, act_msgs: actual_messages});
                    ze_callback(null, actual_messages);
                }
            };

            var handler = {
                message:msg,
                sink:sink
            };

            s.debug_inspect({handler:handler});
            machine.on(handler.message, _.bind(handler.sink, handler));
        }
    );

    // start reading the data
    var go_time = function(err, data) {
        if (err) {
            ze_callback(err, null);
        } else { 
            s.debug_inspect({datalen: data.length});
            machine.read(data.toString());
        }
    };
    fs.readFile(file, go_time);
};

var batch = {
    topic: function() { do_stuff(this.callback, expected_results, 'test/data/top.raw'); },
    'was 123': function(err, val) {
        if (err) {
            s.debug_inspect({err: err});
        }
        assert.ok(false);
    }
}

suite.addBatch({'a thing': batch});




suite.export(module);
