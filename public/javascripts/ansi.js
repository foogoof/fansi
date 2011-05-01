var chars = {
    escape: '\u001b'
};

var util = {};

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

util.starts_sequence = function(octets) {
    if (!(octets && octets.length > 2)) {
        return false;
    } else if (!(octets[0] === chars.escape && octets[1] === '[')) {
        return false;
    }
    return true;
}

util.tokenize_sequence = function(octets, position) {
    var ret = { sequence: nil, octets_consumed: 0 };
    
    if (starts_sequence(octets)) {
        var params = [];
        
        ret.octets_consumed += 2;
        
        for (var i = position; i < octets.length; i++, ret.octets_consumed++) {
            var chr, digit, issemi, isseq;

            chr = octets[i];
            digit = Number(chr);
            if (!digit) issemi = chr === ';';
            if (!(digit || issemi)) isseq = !!util.raw_sequences[chr];
            
            if (digit) {
                params.push(digit);
            } else if (issemi) {
                // noop
            } else if (isseq) {
                ret.sequence = util.raw_sequences[chr].name;
            } else {
                break;
            }
        }
    }

    return ret;
};

exports.util = util;
exports.chars = chars;
