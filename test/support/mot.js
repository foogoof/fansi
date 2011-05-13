// MOT = message oriented testing

var _ = require('underscore');
var s = require('../../public/javascripts/s');
var assert = require('assert');

// TODO: check that results are received in order as their events
// right now the event arguments are just a set, not a vector
var expect = function(emitter, callback /* , event1...n */) {
    var events = _.flatten(_.rest(arguments, 2));
    var results = [];

    var trap = function() {
        _.each(arguments, function(val) { results.push(val); });
        if (results.length === events.length) {
            callback(null, results);
        }
    };

    var that = this;
    _.each(events, function(event) {
        emitter.on(event, trap);
    });
};


var verify = function() {
    var expected = _.toArray(arguments);

    return function(err, vals) {
        assert.equal(err, undefined);
        var actual = _(vals).flatten();

        var ok = true;
        for (var i = 0; i < arguments.length; i++) {
            if (expected[i] !== actual[i]) {
                ok = false;
                break;
            }
        }

        if (!ok) {
            s.debug_inspect({'actual': actual, 'expected': expected});
        }
        assert.ok(ok);
    };
};

exports.verify = verify;
exports.expect = expect;
