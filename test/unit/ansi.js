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
            }
        }
    }
};

suite.addBatch(batch_util);

suite.export(module);
