var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    util = require('util'),
    fansi = require('../../public/javascripts/fansi'),
    s = require('../../public/javascripts/s');

var suite = vows.describe('fansi');

// TODO: check that results are received in order as their events
// right now the event arguments are just a set, not a vector
var transmute = function(value /* , event1...n */) {
    var events = _.rest(arguments);
    var results = [];
    
    return function() {
        var machine = new fansi.Machine();

        var trap = function() {
            _.each(arguments, function(val) { results.push(val); });

            if (results.length === events.length) {
                this.callback(null, results);
            }
        };

        var that = this;
        _.each(events, function(event) {
            machine.on(event, _.bind(trap, that));
        });

        machine.read(value);
    };
}

// TODO: work with var args instead of requiring a vector as an arg
var match_params = function(expected) {
    return function(err, actual) {
        assert.equal(err, undefined);
        if (!_.isEqual(actual, expected)) {
            s.debug_inspect({'actual': actual, 'expected': expected});
        }
        assert.ok(_.isEqual(actual, expected));
    };
};

var flat_data_tests = {
    'friendly plain text data': {
        topic: transmute('hello, world', 'Raw Text'),
        'should be friendly': match_params(['hello, world'])
    },
    'data then control': {
        topic: transmute('hello\x1b[B', 'Raw Text', 'Cursor Down'),
        'should be two lines': match_params(['hello', 1])
    },
    'control then data': {
        topic: transmute('\x1b[2Aworld', 'Cursor Up', 'Raw Text'),
        'should be two lines': match_params([2, 'world'])
    },
    'data then control then data': {
        topic: transmute('hello\x1b[Aworld', 'Raw Text', 'Cursor Up'),
        'should be two lines': match_params(['hello',  1, 'world'])
    }
}

var cursor_down_tests = {
    'param specified with default value': {
        topic: transmute('\x1b[1B', 'Cursor Down'),
        'go down one line': match_params([1])
    },
    'param NOT specified': {
        topic: transmute('\x1b[B', 'Cursor Down'),
        'default value is 1': match_params([1])
    },
    'param specified with custom value': {
        topic: transmute('\x1b[2B', 'Cursor Down'),
        'go down two lines': match_params([2])
    }
};

var cursor_up_tests = {
    'param specified with default value': {
        topic: transmute('\x1b[1A', 'Cursor Up'),
        'go up one line': match_params([1])
    },
    'param NOT specified': {
        topic: transmute('\x1b[A', 'Cursor Up'),
        'default value is 1': match_params([1])
    },
    'param specified with custom value': {
        topic: transmute('\x1b[2A', 'Cursor Up'),
        'go up two lines': match_params([2])
    }
};

var g1_special_char_tests = {
    'use it!': {
        topic: transmute('\x1b)0', 'setspecg1'),
        'catch the message': match_params([undefined])
    }
};

// suite.addBatch({'Cursor Down': cursor_down_tests });
// suite.addBatch({'Cursor Up': cursor_up_tests });
// suite.addBatch({'use g1 special chars': g1_special_char_tests});
suite.addBatch({'friendly data': flat_data_tests});

suite.export(module);
