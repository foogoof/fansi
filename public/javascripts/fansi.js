var events = require('events');
var _ = require('underscore'),
    util = require('util');
var s = require('./s');
var toolbox = require('./toolbox');
var _exp_target = null;

var read_all_codes = function(val) {
    var remainder = val;
    do {
        remainder = this.read_code(remainder);
        // if (remainder) s.debug_inspect({remainder:remainder});
    } while (remainder);
};

var ansi_opcode_map = {
    'A' : { name: 'Cursor Up', defaults: [ 1 ] },
    'B' : { name: 'Cursor Down', defaults: [ 1 ] },
    'C' : { name: 'Cursor Forward', defaults: [ 1 ] },
    'D' : { name: 'Cursor Back', defaults: [ 1 ] },
    'E' : { name: 'Cursor Next Line', defaults: [ 1 ] },
    'H' : { name: 'Cursor Position', defaults: [ 1, 1 ] },
    'J' : { name: 'Erase Data', defaults: [ 0 ] },
    'h' : { name: 'Terminal Config Enable', defaults: [ undefined ] },
    'l' : { name: 'Terminal Config Disable', defaults: [ undefined] },
    'm' : { name: 'Select Graphic Rendition', defaults: [ 0 ] },
    'r' : { name: 'Screen Scroll Enable', defaults: [ undefined, undefined ] } // FIXME: support the variant with NO args :-|
};

var read_code = function(val) {
    var idx;
    var event;
    var code_len;
    var digit, digits;
    var params, raw_params, act_params;
    var opcode, opcode_pos, opcode_attrs;
    var esq_code_data;

    var next_escape = val.indexOf('\x1b');
    var remainder = '';

    params = [];

    if (-1 === next_escape) {
        event = 'Raw Text';
        params.push(val);
    }
    else if (0 !== next_escape) {
        event = 'Raw Text';
        params.push(val.substring(0, next_escape));
        remainder = val.slice(next_escape);
    }
    else if (0 === next_escape) {
        code_len = 1;
        if ('[' === val[1]) {
            esq_code_data = val.slice(2);
            opcode_pos = toolbox.find_opcode_pos(esq_code_data);
            
            if (opcode_pos !== undefined) {
                code_len = opcode_pos + 3; // TODO FIXME LESS UGH
                opcode = esq_code_data[opcode_pos];
                opcode_attrs = ansi_opcode_map[opcode];

                if (opcode_attrs) {
                    raw_params = toolbox.extract_params(esq_code_data, 0, opcode_pos);
                    act_params = toolbox.apply_default_params(raw_params, opcode_attrs.defaults);

                    if (toolbox.have_all_values(act_params)) {
                        event = opcode_attrs.name;
                        params = act_params;
                    }
                }
            }
        } else if (1 === val.indexOf(')')) {
            code_len += 2;
            event = 'setspecg1';
            params.push(undefined);
        } else if (1 == val.indexOf('=')) {
            code_len += 1;
            event = 'Set alternate keypad mode';
            params.push(undefined);
        } else {
            event = '_unknown_' + val[code_len];
            params.push(val[code_len++]);
        }

        remainder = val.slice(code_len);
    }

    if (event) {
        s.debug_inspect({emitting:event, with:params});
        this.emit(event, params);
    } else if (remainder || code_len || digit) {
        s.debug_inspect({warning:'work left in progress',
                         remainder: remainder,
                         digit: digit,
                         code_len: code_len});
    }

    return remainder;
};

var Machine = (function() {
                   util.inherits(Machine, events.EventEmitter);

                   function Machine() {
                   }

                   Machine.prototype.read = read_all_codes;
                   Machine.prototype.read_code = read_code;

                   return Machine;
               })();


try {
    _exp_target = exports;
} catch (reference_error) {
    // outside of of a node.js module this plays in the global scope
    _exp_target = fansi = {};
}

_exp_target.machine = new Machine();
_exp_target.Machine = Machine;
