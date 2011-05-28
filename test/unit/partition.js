var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    tb = require('../../public/javascripts/toolbox'),
    s = require('../../public/javascripts/s');

var suite = vows.describe('tb.partition');

var basics = {
    'when passed undefined': {
        topic: tb.partition(),
        '[] should be returned': function(topic) {
            s.noisy_verify(topic, []);
        }
    },
    'width 1': {
        '[]' : {
            topic: tb.partition(1, []),
            ' => []': function(topic) {
                s.noisy_verify(topic, []);
            }
        },
        '[1]': {
            topic: tb.partition(1, [1]),
            '=> [[1]]': function(topic) {
                s.noisy_verify(topic, [[1]]);
            }
        },
        '[1, 2, 3, 4, 5]': {
            topic: tb.partition(1, [1, 2, 3, 4, 5]),
            '=> [[1], [2], [3], [4], [5]]': function(topic) {
                s.noisy_verify(topic, [[1], [2], [3], [4], [5]]);
            }
        }
    },
    'width 3': {
        '[]' : {
            topic: tb.partition(3, []),
            ' => []': function(topic) {
                s.noisy_verify(topic, []);
            }
        },
        '[1]': {
            topic: tb.partition(3, [1]),
            '=> [[1]]': function(topic) {
                s.noisy_verify(topic, [[1]]);
            }
        },
        '[1, 2, 3, 4, 5]': {
            topic: tb.partition(3, [1, 2, 3, 4, 5]),
            '=> [[1, 2, 3], [4, 5]]': function(topic) {
                s.noisy_verify(topic, [[1, 2, 3], [4, 5]]);
            }
        }
    }
};

suite.addBatch({'basics': basics});

suite.export(module);
