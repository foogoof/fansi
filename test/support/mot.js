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

exports.match_params = match_params;
exports.expect = expect;
