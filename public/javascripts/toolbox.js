var s = require('./s');

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

var extract_params = function(data, end) {
    var params, idx, num, lim;

    if (data === undefined || end === undefined) {
        return undefined;
    }

    for (params = [], num = '', idx = 0, lim = Math.min(data.length, end); idx < lim; idx++) {
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

exports.find_opcode_pos = find_opcode_pos;
exports.extract_params = extract_params;
