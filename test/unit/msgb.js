var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    fansi = require('../../public/javascripts/fansi');

var suite = vows.describe('fansi');

var transmute = function(event, value) {
    return function() {
        var trap = function() {
            this.callback(null, _.compact(arguments));
        };

        fansi.machine.removeAllListeners(event);
        fansi.machine.on(event, _.bind(trap, this));
        fansi.machine.read(value);
    };
}

var match_params = function(expected) {
    return function(err, actual) {
        assert.equal(err, undefined);
        assert.ok(_.isEqual(actual, expected));
    };
};

var cursor_down_tests = {
    'param specified with default value': {
        topic: transmute('Cursor Down', '\x1b[1B'),
        'go down one line': match_params([1])
    },
    'param NOT specified': {
        topic: transmute('Cursor Down', '\x1b[B'),
        'default value is 1': match_params([1])
    },
    'param specified with custom value': {
        topic: transmute('Cursor Down', '\x1b[2B'),
        'go down two lines': match_params([2])
    }
};

var cursor_up_tests = {
    'param specified with default value': {
        topic: transmute('Cursor Up', '\x1b[1A'),
        'go up one line': match_params([1])
    },
    'param NOT specified': {
        topic: transmute('Cursor Up', '\x1b[A'),
        'default value is 1': match_params([1])
    },
    'param specified with custom value': {
        topic: transmute('Cursor Up', '\x1b[2A'),
        'go up two lines': match_params([2])
    }
};

var g1_special_char_tests = {
    'use it!': {
        topic: transmute('setspecg1', '\x1b)0'),
        'catch the message': match_params([])
    }
};

suite.addBatch({'Cursor Down': cursor_down_tests });
suite.addBatch({'Cursor Up': cursor_up_tests });
suite.addBatch({'use g1 special chars': g1_special_char_tests});

suite.export(module);
