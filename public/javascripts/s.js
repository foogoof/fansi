// fansi is a javascript project to convert control sequences into events
//
// Copyright (C) 2011  Seth Schroeder <foogoof@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

var _ = require('underscore');
var util = require('util');
var assert = require('assert');

var debug_inspect = _.compose(util.debug, util.inspect);

function noisy_verify(actual, expected) {
    if (!_.isEqual(actual, expected)) {
        debug_inspect({wanted:expected, got:actual});
        assert.ok(false);
    }
}

exports.debug_inspect = debug_inspect;
exports.noisy_verify = noisy_verify;
