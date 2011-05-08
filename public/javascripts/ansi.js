if (module) {
    var events = require('events');
    var util = require('util');
}

var util = {};

////////////////////////////////////////////////////////////////////////////////

var chars = {
    escape: '\u001b'
};

////////////////////////////////////////////////////////////////////////////////

// http://en.wikipedia.org/wiki/ANSI_escape_code
// lsq = left square bracket = [
var lsq_code_map = {
    'A': { params: {n:1}, acronym: 'CUU', name: 'Cursor Up' },
    'B': { params: {n:1}, acronym: 'CUD', name: 'Cursor Down' },
    'C': { params: {n:1}, acronym: 'CUF', name: 'Cursor Forward' },
    'D': { params: {n:1}, acronym: 'CUB', name: 'Cursor Back' },
    'E': { params: {n:1}, acronym: 'CNL', name: 'Cursor Next Line' },
    'F': { params: {n:1}, acronym: 'CPL', name: 'Cursor Previous Line' },
    'G': { params: {n:null}, acronym: 'CHA', name: 'Cursor Horizontal Absolute' },
    'H': { params: {n:1, m:1}, acronym: 'CUP', name: 'Cursor Position' },
    'J': { params: {n:0}, acronym: 'ED', name: 'Erase Data' },
    'K': { params: {n:0}, acronym: 'EL', name: 'Erase Line' },
    'S': { params: {n:1}, acronym: 'SU', name: 'Scroll Up' },
    'T': { params: {n:1}, acronym: 'SD', name: 'Scroll Down' },
    'f': { params: {n:1, m:1}, acronym: 'HVP', name: 'Horizontal and Vertical Position' },
    'm': { params: {n:0, ks:[]}, acronym: 'SGR', name: 'Select Graphic Rendition' }
};

var rcp_code_map = {
    
};

var wtf_code_map = {
    
};

var escape_sequence_type_maps = {
    '[' : lsq_code_map,
    ')' : rcp_code_map,
    '7' : wtf_code_map,
    '=' : wtf_code_map
};

////////////////////////////////////////////////////////////////////////////////

var Sequence = function(opcode, params) {
    var defaults = code_map[opcode];
    if (!defaults) {
        throw new Error("Unexpected opcode: " + opcode);
    }

    this.acronym = defaults.acronym;
    this.name = defaults.name;
    this.opcode = opcode;

    // TODO: puke when mandatory params are absent ('CHA')
    if (defaults.params) {
        this.n = this.take_first_number(params[0], defaults.n);
        this.m = this.take_first_number(params[1], defaults.m);
    }
};

////////////////////////////////////////////////////////////////////////////////

Sequence.prototype.take_first_number = function(a, b) {
    var val = Number(a);
    if (!isNaN(val))
        return val;
    return Number(b);
}

////////////////////////////////////////////////////////////////////////////////

function SequenceStream() {
    
};

util.inherits(SequenceStream, events.EventEmitter);

////////////////////////////////////////////////////////////////////////////////

SequenceStream.prototype.starts_sequence = function(octets) {
    if (!(octets && octets.length > 2)) {
        return false;
    } else if (!(octets[0] === chars.escape && octets[1] === '[')) {
        return false;
    }
    return true;
};

////////////////////////////////////////////////////////////////////////////////

function CheesyStream(data, offset) {
    this.data = data;
    this.pos = offset || 0;
}

CheesyStream.prototype.get = function() {
    var chr = this.peek(0);
    if (chr !== undefined) {
        this.pos++;
    }
    return chr;
};

CheesyStream.prototype.unget = function() {
    var chr = this.peek(-1);
    if (chr !== undefined) {
        this.pos--;
    }
    return chr;
};

CheesyStream.prototype.peek = function(offset) {
    var idx = this.pos + (offset === undefined ? 0 : offset);
    if (idx < 0 || (idx + 1) >= this.data.length) {
        return undefined;
    }
    return this.data[idx];
};

////////////////////////////////////////////////////////////////////////////////

SequenceStream.prototype.get_next_token = function(stream) {
    var token = '';
    var seq_type = ''; // control or data
    var escape_suffix = '';
    var done = false, rewind = false;

    for (var i = position; i < data.length && !done; i++) {
        var chr = stream.read();

        // starting a control seq?
        if (chr === '\u001b') {
            // already doing something else?
            if (seq_type !== '') {
                done = rewind = true;
            } else {
                seq_type = 'control';
            }
        } else {
            if (seq_type !== '') {
                seq_type = 'data';
            } else if (seq_type === 'data') {
                // noop
            }
            else { // (seq_type === 'control')
                if (token.length === 1) {
                    escape_suffix = chr;
                } else {
                    if (escape_suffix === '[') {
                        if (code_map[chr]) {
                            done = true;
                        }
                    }
                    // TODO else: check other code maps
                }
            }
        }

        if (!rewind) {
            token += chr;
        }
    }
        
    if (rewind) {
        stream.unget();
    }
    
    return token;
};

////////////////////////////////////////////////////////////////////////////////

SequenceStream.prototype.foo = function (data) {
    var token = '';
    var state = ''; // command or data
    
    for (var i = 0; i < data.length; i++) {
    }
};

SequenceStream.prototype.dispatch_sequences = function(octets) {
    var opcode, digits, params = [];

    if (!octets) {
        // TODO: emit event?
        return;
    }

    for (var i = 0; i < octets.length; i++) {
        var chr = octets[i],
            digit = Number(chr);
        
    }

    if (util.starts_sequence(octets)) {

        if (!position) position = 0;
        position += (ret.octets_consumed = 2);

        for (var i = position || 0; i < octets.length; i++, ret.octets_consumed++) {
                raw_seq;

            console.log([chr, digit]);

            if (!isNaN(digit)) {
                if (digits === undefined) { digits = ''; }
                digits += digit;
                continue;
            }

            if (digits !== undefined) {
                params.push(Number(digits));
                digits = undefined;
            }

            if (chr === ';') {
                continue;
            }

            if (chr === '?') {
                continue; // WTH does this mean?
            }
            
            raw_seq = util.raw_sequences[chr];
            if (raw_seq) {
                ret.sequence = new Sequence(chr, params);
            } else {
                throw new Error("Couldn't understand :" + octets.substr(position || 0, ret.octets_consumed));
            }
        }
    }

    return ret;
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
