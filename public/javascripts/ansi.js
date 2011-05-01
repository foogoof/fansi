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
        throw new Exception("Unexpected opcode: " + opcode);
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

util.make_sequence = function(opcode, params) {
    var vals = util.raw_sequences[opcode];
    var seq;
    
    if (vals) {
        
    }

    return seq;
};

////////////////////////////////////////////////////////////////////////////////

util.tokenize_sequence = function(octets, position) {
    var ret = { sequence: null, octets_consumed: 0 };
    
    if (util.starts_sequence(octets)) {
        var opcode, params = [];
        
        if (!position) position = 0;
        position += (ret.octets_consumed = 2);
        
        for (var i = position || 0; i < octets.length; i++, ret.octets_consumed++) {
            var chr, digit, issemi, isseq;

            chr = octets[i];
            digit = Number(chr);
            if (!isNaN(digit)) { issemi = (chr === ';'); }
            if (isNaN(digit) || !issemi) { isseq = !!util.raw_sequences[chr]; }

            //console.log([chr, digit, issemi, isseq]);
            
            if (!isNaN(digit)) {
                params.push(digit);
            } else if (issemi) {
                // noop
            } else if (isseq) {
                ret.sequence = new Sequence(chr, params);
            } else {
                break;
            }
        }
    }

    return ret;
};

if (exports) {
    exports.util = util;
    exports.chars = chars;
}

