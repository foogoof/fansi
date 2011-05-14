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

// preconditions
var extract_params = function(data, end) {
    var params = [], idx;

    if (data === undefined || end === undefined) {
        return undefined;
    }

    // give every opcode a placeholder for a param:
    // those with defaults will replace undefined with the default value.
    // those without defaults need to be able to detect when the param was omitted
    // those without parameters will safely ignore the placeholder
    params.push(undefined);

    for (idx = 0; idx < end; idx++) {
        if (data[idx] === ';') {
            params.push(undefined);
        }
    }

    return params;
};

exports.find_opcode_pos = find_opcode_pos;
exports.extract_params = extract_params;
