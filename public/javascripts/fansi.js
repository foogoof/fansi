if (module) {
    var events = require('events');
    var util = require('util');
}

function machine_factory() {
    var machine = new events.EventEmitter();

    machine.read = function(val) {
        if (val == '\u001b5b3142')
            this.emit('Cursor Down', 1);
        else if (val == '\u001b5b42')
            this.emit('Cursor Down', 1);
        else if (val == '\u001b5b3242')
            this.emit('Cursor Down', 2);
        else
            throw new Error("Wtf is val => " + val);
        return 'wth';
    };

    // util.inherits(Machine, events.eventEmitter);

    return machine;
};

try {
    _exp_target = exports;
} catch (reference_error) {
    // outside of of a node.js module this plays in the global scope
    _exp_target = fansi = {};
}

_exp_target.machine = machine_factory();
