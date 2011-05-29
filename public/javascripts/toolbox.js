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

var s = require('./s'),
    _ = require('underscore');

////////////////////////////////////////////////////////////////////////////////

var find_opcode_pos = function(data) {
    var idx;
    if (!data) {
        return idx;
    }

    for (idx = 0; idx < data.length; idx++) {
        if (data[idx] >= '@' && data[idx] <= '~') {
            break;
        }
    }
    
    if (idx === data.length) {
        return undefined;
    } else {
        return idx;
    }
};

////////////////////////////////////////////////////////////////////////////////

var finish_num = function(num_in_progress) {
    var num;
    if (num_in_progress === '') {
        return undefined; // Number('') === 0
    }
    num = Number(num_in_progress);
    if (isNaN(num))
        return undefined;
    return num;
}

////////////////////////////////////////////////////////////////////////////////

var extract_params = function(data, begin, end) {
    var params, idx, num, lim;

    if (data === undefined || end === undefined) {
        return undefined;
    }

    lim = Math.min(data.length, end);
    for (params = [], num = '', idx = begin; idx < lim; idx++) {
        switch (data[idx]) {
        case ';':
            params.push(finish_num(num));
            num = '';
            break;
        case '?':
            // skip me
            break;
        default:
            num += data[idx];
        }
    }

    params.push(finish_num(num));

    return params;
};

////////////////////////////////////////////////////////////////////////////////

var apply_default_params = function(raw_params, defaults) {
    var act_params = [];

    for (var i = 0; i < Math.max(raw_params.length, defaults.length); i++) {
        var val = raw_params[i];
        if (val === undefined) {
            val = defaults[i];
        }

        act_params[i] = val;
    }

    return act_params;
};

////////////////////////////////////////////////////////////////////////////////

var have_all_values = function(array) {
    return !_.detect(array, function(v) { return v === undefined; });
}

////////////////////////////////////////////////////////////////////////////////

var partition = function(width, seq) {
    var ret = [];

    if (!seq || !width) {
        return ret;
    }

    for (var i = 0; i < seq.length; i++) {
        var bucket_idx = Math.floor(i / width);
        var drop_idx = i % width;

        if (!ret[bucket_idx]) {
            ret[bucket_idx] = [];
        }

        ret[bucket_idx][drop_idx] = seq[i];
    }

    return ret;
};

////////////////////////////////////////////////////////////////////////////////

exports.find_opcode_pos = find_opcode_pos;
exports.extract_params = extract_params;
exports.apply_default_params = apply_default_params;
exports.have_all_values = have_all_values;
exports.partition = partition;
