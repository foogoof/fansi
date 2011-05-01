var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('smoke');

var context = {
    topic: 'coffee',
    'is yummy': function(something) {
        assert.equal(something, 'coffee');
    }
};

suite.addBatch({'caffeine': context});

//suite.run();
suite.export(module);
