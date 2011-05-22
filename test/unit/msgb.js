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
        'hello': mot.verify('hello, world')
    },
    'data then control': {
        topic: setup({data:'hello\x1b[B', events:['Raw Text', 'CursorDown']}),
        'hello, down': mot.verify('hello', 1)
    },
    'control then data': {
        topic: setup({data: '\x1b[2Aworld', events:['CursorUp', 'Raw Text']}),
        'up, world': mot.verify(2, 'world')
    },
    'data then control then data': {
        topic: setup({data: 'hello\x1b[Aworld', events:['Raw Text', 'CursorUp']}),
        'hello, up, world': mot.verify('hello',  1, 'world')
    }
};

var cursor_down_tests = {
    'param specified with default value': {
        topic: setup({data: '\x1b[1B', event:'CursorDown'}),
        'go down one line': mot.verify(1)
    },
    'param NOT specified': {
        topic: setup({data: '\x1b[B', event:'CursorDown'}),
        'default value is 1': mot.verify(1)
    },
    'param specified with custom value': {
        topic: setup({data: '\x1b[2B', event:'CursorDown'}),
        'go down two lines': mot.verify(2)
    }
};

var cursor_up_tests = {
    'param specified with default value': {
        topic: setup({data: '\x1b[1A', event:'CursorUp'}),
        'go up one line': mot.verify(1)
    },
    'param NOT specified': {
        topic: setup({data: '\x1b[A', event:'CursorUp'}),
        'default value is 1': mot.verify(1)
    },
    'param specified with custom value': {
        topic: setup({data: '\x1b[2A', event:'CursorUp'}),
        'go up two lines': mot.verify(2)
    }
};

var g1_special_char_tests = {
    'use it!': {
        topic: setup({data: '\x1b)0', event:'setspecg1'}),
        'catch the message': mot.verify(undefined)
    }
};

var basic_ansi_coverage_tests = {
    'Cursor Up': {
        topic: setup({data: '\x1b[A', event:'CursorUp' }),
        'got it': mot.verify(1)
    },
    'Cursor Down': {
        topic: setup({data: '\x1b[B', event:'CursorDown' }),
        'got it': mot.verify(1)
    },
    'Cursor Forward': {
        topic: setup({data: '\x1b[C', event:'CursorForward' }),
        'got it': mot.verify(1)
    },
    'Cursor Position': {
        topic: setup({data: '\x1b[H', event:'CursorPosition' }),
        'got it': mot.verify(1,1)
    }
};

var parameter_tests = {
    'missing left': {
        topic: setup({data:'\x1b[;0H', event: 'CursorPosition'}),
        'got 1 0': mot.verify(1, 0)
    },
    'missing right': {
        topic: setup({data:'\x1b[0;H', event: 'CursorPosition'}),
        'got 0 1': mot.verify(0, 1)
    },
    'have both': {
        topic: setup({data:'\x1b[0;0H', event:'CursorPosition'}),
        'got 0 0': mot.verify(0, 0)
    },
    'have none': {
        topic: setup({data:'\x1b[;H', event:'CursorPosition'}),
        'got 1 1': mot.verify(1, 1)
    }
};

var unknown_tests = {
    '\x1b7' : {
        topic: setup({data:'\x1b7foo', events:['_unknown_7', 'Raw Text']}),
        'ignored crap, got text': mot.verify('7', 'foo')
    },
    '\x1b=' : {
        topic: setup({data:'\x1b=', event: 'Set alternate keypad mode'}),
        'set alt. keypad mode': mot.verify(undefined)
    }
};

var focus = 0;
if (focus) {
    suite.addBatch({'friendly data': flat_data_tests});
} else {
    suite.addBatch({'Cursor Down': cursor_down_tests });
    suite.addBatch({'Cursor Up': cursor_up_tests });
    suite.addBatch({'basic ansi': basic_ansi_coverage_tests});
    suite.addBatch({'friendly data': flat_data_tests});
    suite.addBatch({'params': parameter_tests});
    suite.addBatch({'unknown_tests': unknown_tests});
    suite.addBatch({'use g1 special chars': g1_special_char_tests});
}

suite.export(module);
