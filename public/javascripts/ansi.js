var util = {};

////////////////////////////////////////////////////////////////////////////////

var chars = {
    escape: '\u001b'
};

////////////////////////////////////////////////////////////////////////////////

// http://en.wikipedia.org/wiki/ANSI_escape_code
util.raw_sequences = {
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

////////////////////////////////////////////////////////////////////////////////

util.take_first_number = function(a, b) {
    var val = Number(a);
    if (!isNaN(val))
        return val;
    return Number(b);
}

////////////////////////////////////////////////////////////////////////////////

var Sequence = function(opcode, params) {
    var defaults = util.raw_sequences[opcode];
    if (!defaults) {
        throw new Error("Unexpected opcode: " + opcode);
    }

    this.acronym = defaults.acronym;
    this.name = defaults.name;
    this.opcode = opcode;

    if (defaults.params) {
        this.n = util.take_first_number(params[0], defaults.n);
        this.m = util.take_first_number(params[1], defaults.m);
    }
};

////////////////////////////////////////////////////////////////////////////////

util.starts_sequence = function(octets) {
    if (!(octets && octets.length > 2)) {
        return false;
    } else if (!(octets[0] === chars.escape && octets[1] === '[')) {
        return false;
    }
    return true;
};

////////////////////////////////////////////////////////////////////////////////

util.tokenize_sequence = function(octets, position) {
    var ret = { sequence: null, octets_consumed: 0 };

    if (util.starts_sequence(octets)) {
        var opcode, digits, params = [];

        if (!position) position = 0;
        position += (ret.octets_consumed = 2);

        for (var i = position || 0; i < octets.length; i++, ret.octets_consumed++) {
            var chr = octets[i],
                digit = Number(chr),
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
            
            raw_seq = util.raw_sequences[chr];
            if (raw_seq) {
                ret.sequence = new Sequence(chr, params);
            } else {
                throw new Error("Couldn't understand :" + octets.substr(position, ret.octets_consumed));
            }
        }
    }

    return ret;
};

if (exports) {
    exports.util = util;
    exports.chars = chars;
    exports.Sequence = Sequence;
}

