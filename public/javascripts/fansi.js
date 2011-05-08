if (module) {
    var events = require('events');
    var util = require('util');
}

var read_code = function(val) {
    var event = undefined;
    var rows = undefined;

    if (0 === val.indexOf('\u001b')) {
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
};

function machine_factory() {
    // TODO: make less crappy
    var machine = new events.EventEmitter();
    machine.read = read_code;
    return machine;
};

try {
    _exp_target = exports;
} catch (reference_error) {
    // outside of of a node.js module this plays in the global scope
    _exp_target = fansi = {};
}

_exp_target.machine = machine_factory();
