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

exports.find_opcode_pos = find_opcode_pos;
exports.extract_params = extract_params;
exports.apply_default_params = apply_default_params;
exports.have_all_values = have_all_values;
