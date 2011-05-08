if (module) {
    var events = require('events');
    var util = require('util');
    var _ = require('underscore');
    var debug_inspect = _.compose(util.debug, util.inspect);
}

var read_all_codes = function(val) {
    var remainder = val;
    do {
        remainder = this.read_code(remainder);
        if (remainder) debug_inspect({remainder: remainder});
    } while (remainder);
}

var read_code = function(val) {
    var event = undefined;
    var rows = undefined;

    var next_escape = val.indexOf('\x1b');
    var remainder = '';

    if (-1 === next_escape) {
        event = 'Raw Text';
        rows = val;
    }
    else if (0 !== next_escape) {
        event = 'Raw Text';
        rows = val.substring(0, next_escape);
        remainder = val.substring(next_escape, val.length);
    }
    else if (0 === next_escape) {
        if (1 === val.indexOf('[')) {
            if (val.match(/A$/) ) {
                event = 'Cursor Up';
            } else if (val.match(/B$/)) {
                event = 'Cursor Down';
            }
        
            if (val.match(/\[2/)) {
                rows = 2;
            } else if (val.match(/\[1/) || val.match(/\[[^\d]/)) {
                rows = 1;
            }
        } else if (1 === val.indexOf(')')) {
            event = 'setspecg1';
        }
    }

    if (event) {
        this.emit(event, rows);
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
