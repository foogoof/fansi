var events = require('events');
var _ = require('underscore'),
    _str = require('underscore.string'),
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
    'A' : { name: 'CursorUp', defaults: [ 1 ] },
    'B' : { name: 'CursorDown', defaults: [ 1 ] },
    'C' : { name: 'CursorForward', defaults: [ 1 ] },
    'D' : { name: 'CursorBack', defaults: [ 1 ] },
    'E' : { name: 'CursorNext Line', defaults: [ 1 ] },
    'H' : { name: 'CursorPosition', defaults: [ 1, 1 ] },
    'J' : { name: 'EraseData', defaults: [ 0 ] },
    'h' : { name: 'TerminalConfigEnable', defaults: [ undefined ] },
    'l' : { name: 'TerminalConfigDisable', defaults: [ undefined] },
    'm' : { name: 'SelectGraphicRendition', defaults: [ 0 ] },
    'r' : { name: 'ScreenScrollEnable', defaults: [ undefined, undefined ] } 
// FIXME: support the variant with NO args :-|
};

var ansi_events = _.reduce(ansi_opcode_map, function(event_map, map) {
    var name = map.name;
    event_map[_str.underscored(name)] = name;
    return event_map;
}, {});

var misc_opcodes = {
    ')' : { name: 'setspecg1', defaults: [ undefined ] },
    '=' : { name: 'Set alternate keypad mode', defaults: [ undefined ] }
};

// TODO: automate the creation of this object
var misc_events = {
    setspecg1: 'setspecg1',
    unknown7: '_unknown_7',
    set_alternate_keypad_mode: 'Set alternate keypad mode',
    raw_text: 'raw_text'
};

var event = _.extend({}, ansi_events, misc_events);

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
        event = misc_events.raw_text;
        params.push(val);
    }
    else if (0 !== next_escape) {
        event = misc_events.raw_text;
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
            event = misc_opcodes[')'].name;
            params.push(undefined);
        } else if (1 == val.indexOf('=')) {
            code_len += 1;
            event = misc_opcodes['='].name;
            params.push(undefined);
        } else {
            event = '_unknown_' + val[code_len];
            params.push(val[code_len++]);
        }

        remainder = val.slice(code_len);
    }

    if (event) {
        // s.debug_inspect({emitting:event, with:params});
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
_exp_target.event = event;
