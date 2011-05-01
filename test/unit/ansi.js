var vows = require('vows'),
    assert = require('assert'),
    ansi = require('../../public/javascripts/ansi');

var suite = vows.describe('ansi');

// var context = {
//     topic: '\u001b',
//     'escape': function(topic) {
//         assert.equal(ansi.chars.escape, topic);
//     }
// };

// suite.addBatch({'chars': context});

// var cursor_position = {
//     'cursor_position': {
//         topic: '\u001b[H',
//         'toString': function(exp) {
//             assert.equal(exp, ansi.sequences.cursor_position.toString());
//         }
//     }
// };

// suite.addBatch(cursor_position);

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
                assert.equal(ret.sequence, 'Cursor Up');
                assert.equal(ret.octets_consumed, 4);
            }
        }
    }
};

suite.addBatch(batch_util);

suite.export(module);
