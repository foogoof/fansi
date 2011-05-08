if (module) {
    var events = require('events');
    var util = require('util');
}

var read_code = function(val) {
    var event = undefined;
    var rows = undefined;

    if (0 === val.indexOf('\u001b5b')) {
        if (val.match(/41$/) ) {
            event = 'Cursor Up';
        } else if (val.match(/42$/)) {
            event = 'Cursor Down';
        }
        
        if (val.match(/5b(31)?4/)) {
            rows = 1;
        } else if (val.match(/5b32/)) {
            rows = 2;
        }
    } else if (0 === val.indexOf('\u001b29')) {
        event = 'setspecg1';
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
