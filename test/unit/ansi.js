var vows = require('vows'),
    assert = require('assert'),
    ansi = require('../../public/javascripts/ansi');

var suite = vows.describe('ansi');

var batch_util = {
    'utility functions': {
        'starts_sequence' : {
            'can detect a simple sequence': function() {
                assert.ok(ansi.util.starts_sequence('\u001b[foobar'));
            },
            'rejects something obviously not a sequence': function() {
                assert.ok(!ansi.util.starts_sequence('foobar'));
            },
            'rejects a truncated sequence': function() {
                assert.ok(!ansi.util.starts_sequence('\u001b['));
            },
            'groks undefined': function() {
                assert.ok(!ansi.util.starts_sequence());
            }
        },

        'take_first_number': {
            'groks undefined': function() {
                assert.ok(isNaN(ansi.util.take_first_number()));
            }
        },

        'tokenize_sequence': {
            'groks undefined': function() {
                var ret = ansi.util.tokenize_sequence();
                assert.ok(!ret.sequence);
                assert.ok(ret.octets_consumed === 0);
            },
            'rejects crap': function() {
                var ret = ansi.util.tokenize_sequence('abc');
                assert.ok(!ret.sequence);
                assert.ok(ret.octets_consumed === 0);
            },
            'handles a simple CUU': function() {
                var ret = ansi.util.tokenize_sequence('\u001b[0A');
                assert.equal(ret.sequence.opcode, 'A');
                assert.equal(ret.sequence.name, 'Cursor Up');
                assert.equal(ret.octets_consumed, 4);
                assert.equal(ret.sequence.n, 0);
            },
            'handles a basic CUP': function() {
                var ret = ansi.util.tokenize_sequence('\u001b[1;66H');
                assert.equal(ret.sequence.opcode, 'H');
                assert.equal(ret.sequence.name, 'Cursor Position');
                assert.equal(ret.octets_consumed, 7);
                assert.equal(ret.sequence.n, 1);
                assert.equal(ret.sequence.m, 66);
            },
            'pukes on unknown sequence': function() {
                assert.throws(function() { ansi.util.tokenize_sequence('\u001b[['); },
                              /Couldn't understand/);
            }
        }
    }
};

suite.addBatch(batch_util);

suite.export(module);
