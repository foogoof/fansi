var _ = require('underscore'),
    util = require('util'),
    assert = require('assert');

var debug_inspect = _.compose(util.debug, util.inspect);

function noisy_verify(actual, expected) {
    if (!_.isEqual(actual, expected)) {
        debug_inspect({wanted:expected, got:actual});
        assert.ok(false);
    }
};

exports.debug_inspect = debug_inspect;
exports.noisy_verify = noisy_verify;
