var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    util = require('util'),
    fansi = require('../../public/javascripts/fansi'),
    s = require('../../public/javascripts/s'),
    mot = require('../support/mot');

var suite = vows.describe('top');

var setup = function(hash) {
    return function() {
        assert.ok(hash.event || hash.events);
        assert.ok(hash.data);
        
        var machine = new fansi.Machine();
        mot.expect(machine, this.callback, hash.event || hash.events);
        machine.read(hash.data);
    };
};

var top_raw_data = [
    '\x1b',    ')',    '0', '\x1b',   '7', '\x1b',    '[',   '?',
       '4',    '7',    'h', '\x1b',   '[',    '1',    ';',   '2',
       '7',    'r', '\x1b',    '[',   'm', '\x1b',    '[',   '4',
       'l', '\x1b',    '[',    '?',   '1',    'h', '\x1b',   '=',
    '\x1b',    '[',    'H', '\x1b',   '[',    '2',    'J'
];

var batch = {
    'try it': {
        topic: setup({data:top_raw_data, 
                      events: ['setspecg1',
                               '_unknown_7',
                               'TerminalConfigEnable',
                               'ScreenScrollEnable',
                               'SelectGraphicRendition',
                               'TerminalConfigDisable',
                               // 'Terminal Config Enable',
                               'Set alternate keypad mode',
                               fansi.event.cursor_position,
                               //'Cursor Position',
                               'EraseData'
                              ]}),
        'got the stuff': mot.verify(undefined, '7', 47, 1, 27, 0, 4, 1, undefined, 1, 1, 2)
    }
};

var Emulator = function() {
};

Emulator.prototype.set_height = function(params) {
    this.height = params[1];
};

Emulator.prototype.dispatch = function(params) {
    s.debug_inspect({caught:event, with:params});

    if (event === 'Screen Scroll Enable') {
        this.set_height(params[1]);
    }
};

var emulate_batch = {
    'set screen height': {
        topic: function() {
            var em = new Emulator(this.callback);
            var fm = new fansi.Machine();
            var that = this;
            fm.on(fansi.event.screen_scroll_enable, function(args) { em.set_height(args); that.callback(null, em); });
            fm.read('\x1b[1;27r');
            return em;
        },
        '27 rows tall': function(em) {
            assert.equal(em.height, 27);
        }
    }
};

var focus = 0;
if (focus) {
    suite.addBatch({'em': emulate_batch});
} else {
    suite.addBatch({'gopher!': batch});
    suite.addBatch({'em': emulate_batch});
}

suite.export(module);
