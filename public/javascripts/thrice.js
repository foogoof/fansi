if (module) {
    var events = require('events');
    var util = require('util');
}

var ansi = {}, vt100 = { };

// '\u000d' => 'carriage return' // remap to another code??
// '\u001b5b3142' => 'line feed'

////////////////////////////////////////////////////////////////////////////////

var chars = {
    escape: '\u001b'
};

ansi.defaults = {
    'H': [0, 0],
    'J': [0]
};

try {
    _exp_target = exports;
} catch (reference_error) {
    // outside of of a node.js module this plays in the global scope
    _exp_target = ansi = {};
}

_exp_target.Sequence = Sequence;
_exp_target.SequenceStream = SequenceStream;
_exp_target.chars = chars;
_exp_target.code_map = code_map;
