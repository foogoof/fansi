// source: http://ascii-table.com/ansi-escape-sequences-vt-100.php
// CSI = '\u001b5b'

var unsupported_sequence = function(seq) {
    return 'unsupported sequence: ' + (seq || '');
};

var vt100_sequences = {
    '#' : {
        '3': unsupported_sequence,
        '4': unsupported_sequence,
        '6': unsupported_sequence,
        '8': unsupported_sequence
    },
    '(' : {
        'A': unsupported_sequence,
        'B': unsupported_sequence,
        '0': unsupported_sequence,
        '1': unsupported_sequence,
        '2': unsupported_sequence
    },
    ')' : {
        'A': unsupported_sequence,
        'B': unsupported_sequence,
        '0': unsupported_sequence,
        '1': unsupported_sequence,
        '2': unsupported_sequence
    },
    '0' : {
        'n': unsupported_sequence
    },
    '3' : {
        'n': unsupported_sequence
    },
    '5' : {
        'n': unsupported_sequence
    },
    '6' : {
        'n': unsupported_sequence
    },
    '7' : unsupported_sequence,
    '8' : unsupported_sequence,
    '=' : unsupported_sequence,
    '>' : unsupported_sequence,
    'D' : unsupported_sequence,
    'E' : unsupported_sequence,
    'H' : unsupported_sequence,
    'M' : unsupported_sequence,
    'N' : unsupported_sequence,
    'O' : unsupported_sequence,
    'c' : unsupported_sequence,
    '?' : {
        '1': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '2': {
            //'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '3': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '4': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '5': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '6': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '7': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '8': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        },
        '9': {
            'h': unsupported_sequence,
            'l': unsupported_sequence
        }
    },
    '[' : {
        '2' : {
            '0' : {
                'h' : unsupported_sequence,
                'l' : unsupported_sequence
            }
        }
    }
};

// CSI = '\u001b5b' / Esc[
var ansi_sequences = {
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
