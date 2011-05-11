var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    util = require('util'),
    fansi = require('../../public/javascripts/fansi'),
    s = require('../../public/javascripts/s'),
    mot = require('../support/mot');

var suite = vows.describe('fansi');

var setup = function(hash) {
    return function() {
        assert.ok(hash.event || hash.events);
        assert.ok(hash.data);
        
        var machine = new fansi.Machine();
        mot.expect(machine, this.callback, hash.event || hash.events);
        machine.read(hash.data);
    };
};

var flat_data_tests = {
    'friendly plain text data': {
        topic: setup({data:'hello, world', event:'Raw Text'}),
        'hello': mot.match_params(['hello, world'])
    },
    'data then control': {
        topic: setup({data:'hello\x1b[B', events:['Raw Text', 'Cursor Down']}),
        'hello, down': mot.match_params(['hello', 1])
    },
    'control then data': {
        topic: setup({data: '\x1b[2Aworld', events:['Cursor Up', 'Raw Text']}),
        'up, world': mot.match_params([2, 'world'])
    },
    'data then control then data': {
        topic: setup({data: 'hello\x1b[Aworld', events:['Raw Text', 'Cursor Up']}),
        'hello, up, world': mot.match_params(['hello',  1, 'world'])
    }
}

var cursor_down_tests = {
    'param specified with default value': {
        topic: setup({data: '\x1b[1B', event:'Cursor Down'}),
        'go down one line': mot.match_params([1])
    },
    'param NOT specified': {
        topic: setup({data: '\x1b[B', event:'Cursor Down'}),
        'default value is 1': mot.match_params([1])
    },
    'param specified with custom value': {
        topic: setup({data: '\x1b[2B', event:'Cursor Down'}),
        'go down two lines': mot.match_params([2])
    }
};

var cursor_up_tests = {
    'param specified with default value': {
        topic: setup({data: '\x1b[1A', event:'Cursor Up'}),
        'go up one line': mot.match_params([1])
    },
    'param NOT specified': {
        topic: setup({data: '\x1b[A', event:'Cursor Up'}),
        'default value is 1': mot.match_params([1])
    },
    'param specified with custom value': {
        topic: setup({data: '\x1b[2A', event:'Cursor Up'}),
        'go up two lines': mot.match_params([2])
    }
};

var g1_special_char_tests = {
    'use it!': {
        topic: setup({data: '\x1b)0', event:'setspecg1'}),
        'catch the message': mot.match_params([undefined])
    }
};

suite.addBatch({'Cursor Down': cursor_down_tests });
suite.addBatch({'Cursor Up': cursor_up_tests });
suite.addBatch({'use g1 special chars': g1_special_char_tests});
suite.addBatch({'friendly data': flat_data_tests});

suite.export(module);
