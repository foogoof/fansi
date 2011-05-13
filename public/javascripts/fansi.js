var events = require('events');
var _ = require('underscore'),
    util = require('util');
var s = require('./s');

var read_all_codes = function(val) {
    var remainder = val;
    do {
        remainder = this.read_code(remainder);
        // if (remainder) s.debug_inspect({remainder:remainder});
    } while (remainder);
};

var read_code = function(val) {
    var event = undefined;
    var code_len = undefined;
    var digit = undefined, digits = undefined;
    var params = [];

    var next_escape = val.indexOf('\x1b');
    var remainder = '';

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

        if ('[' === val[code_len]) {
            digits = '';
            code_len++;

            do {
                var chr = val[code_len];
                
                digit = Number(chr);
                if (!isNaN(digit)) {
                    digits += digit;
                    code_len++;
                } else if (';' === chr) {
                    if (0 === digits.length) {
                        params.push(1); // FIXME: default value depends on opcode
                    } else {
                        params.push(Number(digits));
                    }
                    digits = '';
                    code_len++;
                } else {
                    break;
                }
            } while(true);

            if (digits.length > 0) {
                params.push(Number(digits));
            } else {
                params.push(1);
            }

            if ('A' == val[code_len] ) {
                event = 'Cursor Up';
            } else if ('B' == val[code_len]) {
                event = 'Cursor Down';
            } else if ('C' == val[code_len]) {
                event = 'Cursor Forward';
            } else if ('H' == val[code_len]) {
                event = 'Cursor Position';
            }
            code_len++;
        } else if (1 === val.indexOf(')')) {
            code_len += 2;
            event = 'setspecg1';
        } else {
            event = '_unknown_' + val[code_len];
            params.push(val[code_len++]);
        }

        remainder = val.slice(code_len);
    }

    if (event) {
        //s.debug_inspect({emitting:event, with:params});
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
