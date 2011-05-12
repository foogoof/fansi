var events = require('events');
var _ = require('underscore'),
    util = require('util');
var s = require('./s');

var read_all_codes = function(val) {
    var remainder = val;
    do {
        remainder = this.read_code(remainder);
    } while (remainder);
};

var read_code = function(val) {
    var event = undefined;
    var rows = undefined;
    var code_len = undefined;
    var digit = undefined;

    var next_escape = val.indexOf('\x1b');
    var remainder = '';

    if (-1 === next_escape) {
        event = 'Raw Text';
        rows = val;
    }
    else if (0 !== next_escape) {
        event = 'Raw Text';
        rows = val.substring(0, next_escape);
        remainder = val.slice(next_escape);
    }
    else if (0 === next_escape) {
        code_len = 1;
        if ('[' === val[code_len]) {
            code_len++;

            digit = Number(val[code_len]);
            if (!isNaN(digit)) {
                rows = digit;
                code_len++;
            } else {
                rows = 1;
            }

            if ('A' == val[code_len] ) {
                event = 'Cursor Up';
            } else if ('B' == val[code_len]) {
                event = 'Cursor Down';
            } else if ('C' == val[code_len]) {
                event = 'Cursor Forward';
            }
            code_len++;
        } else if (1 === val.indexOf(')')) {
            code_len += 2;
            event = 'setspecg1';
        }

        remainder = val.slice(code_len);
    }

    // s.debug_inspect({event:event, rows:rows});
    if (event) {
        this.emit(event, rows);
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
