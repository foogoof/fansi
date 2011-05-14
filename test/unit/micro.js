var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    toolbox = require('../../public/javascripts/toolbox'),
    s = require('../../public/javascripts/s');

var suite = vows.describe('smoke');

function noisy_verify(actual, expected) {
    if (!_.isEqual(actual, expected)) {
        s.debug_inspect({wanted:expected, got:actual});
        assert.ok(false);
    }
};

var find_opcode_batch = {
    '': {
        'none in empty str': function() {
            assert.equal(toolbox.find_opcode_pos(), undefined);
        },
        'none in just numbers': function() {
            assert.equal(toolbox.find_opcode_pos('123'), undefined);
        }
    },
    'cursor up': {
        'implicit param': function() {
            assert.equal(toolbox.find_opcode_pos('A'), 0);
        },
        'explicit param': function() {
            assert.equal(toolbox.find_opcode_pos('5A'), 1);
        }
    },
    'cursor position': {
        'just semi': function() {
            assert.equal(toolbox.find_opcode_pos(';H'), 1);
        },
        'left param': function() {
            assert.equal(toolbox.find_opcode_pos('9;H'), 2);
        },
        'right param': function() {
            assert.equal(toolbox.find_opcode_pos(';3H'), 2);
        },
        'both params': function() {
            assert.equal(toolbox.find_opcode_pos('9;3H'), 3);
        }
    },
    'boundary conditions': {
        'below lower bound excluded': function() {
            assert.equal(toolbox.find_opcode_pos('\x39'), undefined);
        },
        'lower bound included': function() {
            assert.equal(toolbox.find_opcode_pos('\x40'), 0);
        },
        'upper bound included': function() {
            assert.equal(toolbox.find_opcode_pos('\x7e'), 0);
        },
        'above upper bound excluded': function() {
            assert.equal(toolbox.find_opcode_pos('\x7f'), undefined);
        }
    }
};

var identify_params_batch = {
    'bogus param check': {
        'ok with too few args': function() {
            assert.equal(toolbox.extract_params(), undefined);
            assert.equal(toolbox.extract_params(undefined), undefined);
            assert.equal(toolbox.extract_params(''), undefined);
            assert.equal(toolbox.extract_params('0'), undefined);
        }
    },
    'implicit param': {
        'placeholder returned for empty string': function() {
            noisy_verify(toolbox.extract_params('', 0, 0), [undefined]);
        },
        'one ; => 2 placeholders': function() {
            noisy_verify(toolbox.extract_params(';', 0, 1), [undefined, undefined]);
        },
        'many ; => many + 1 placeholders': function() {
            noisy_verify(toolbox.extract_params(';;;', 0, 3), [undefined, undefined, undefined, undefined]);
        }
    },
    'explicit param': {
        'value returned for simple string': function() {
            noisy_verify(toolbox.extract_params('0', 0, 1), [0]);
        },
        'left value, one placeholder': function() {
            noisy_verify(toolbox.extract_params('0;', 0, 2), [0, undefined]);
        },
        'right value, one placeholder': function() {
            noisy_verify(toolbox.extract_params(';3', 0, 2), [undefined, 3]);
        },
        'two values, one placeholder': function() {
            noisy_verify(toolbox.extract_params('0;3', 0, 3), [0, 3]);
        },
        'all values, many placeholders': function() {
            noisy_verify(toolbox.extract_params('0;1;2', 0, 5), [0, 1, 2]);
        },
        'some values, many placeholders': function() {
            noisy_verify(toolbox.extract_params('0;;2', 0, 5), [0, undefined, 2]);
        }
    },
    'multiple digit numbers': {
        '0123': function() {
            noisy_verify(toolbox.extract_params('123', 0, 3), [123]);
        }
    },
    'skip crap': {
        '?47': function() {
            noisy_verify(toolbox.extract_params('?47', 0, 3), [47]);
        }
    }
};

suite.addBatch({'toolbox.find_opcode_pos': find_opcode_batch});
suite.addBatch({'toolbox.extract_params': identify_params_batch});

suite.export(module);
