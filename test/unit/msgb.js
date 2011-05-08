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
        topic: transmute('Cursor Down', '\u001b5b3142'),
        'go down one line': match_params([1])
    },
    'param NOT specified': {
        topic: transmute('Cursor Down', '\u001b5b42'),
        'default value is 1': match_params([1])
    },
    'param specified with custom value': {
        topic: transmute('Cursor Down', '\u001b5b3242'),
        'go down two lines': match_params([2])
    }
};

suite.addBatch({'Cursor Down': cursor_down_tests });

suite.export(module);
