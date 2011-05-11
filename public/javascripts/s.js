var _ = require('underscore'),
    util = require('util');

var debug_inspect = _.compose(util.debug, util.inspect);

exports.debug_inspect = debug_inspect;
