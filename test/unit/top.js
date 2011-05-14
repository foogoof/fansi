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

// TODO FIXME CANNOT BE THIS HARD
var top_raw_data_str = _.reduce(top_raw_data, function(m,v) { return m.toString() + v.toString(); });

var batch = {
    'try it': {
        topic: setup({data:top_raw_data, 
                      events: ['setspecg1',
                               '_unknown_7',
                               'Terminal Config Enable',
                               'Screen Scroll Enable',
                               'Select Graphic Rendition',
                               'Terminal Config Disable',
                               // 'Terminal Config Enable',
                               'Set alternate keypad mode',
                               'Cursor Position',
                               'Erase Data'
                              ]}),
        'got the stuff': mot.verify(undefined, '7', 47, 1, 27, 0, 4, 1, undefined, 1, 1, 2)
    }
};

var focus = 1;
if (focus) {
    suite.addBatch({'gopher!': batch});
} else {
}

suite.export(module);
