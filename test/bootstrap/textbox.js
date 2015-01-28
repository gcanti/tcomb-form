'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap textbox()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    type: 'text'
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Textbox(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.textbox(locals));
    if (showDiff) {
      console.dir(diff(actual, expected));
    }
    tape.deepEqual(actual, expected);
  };

  tape.test('base', function (tape) {
    tape.plan(1);
    equal(tape, {}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text',
          disabled: true
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('error', function (tape) {
    tape.plan(1);
    equal(tape, {error: 'myerror', hasError: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true, 'has-error': true}
      },
      children: [
        {
          tag: 'input',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            type: 'text'
          },
          events: {
            change: base.onChange
          }
        },
        {
          tag: 'span',
          attrs: {
            className: {
              'help-block': true,
              'error-block': true
            }
          },
          children: 'myerror'
        }
      ]
    });
  });

  tape.test('help', function (tape) {
    tape.plan(1);
    equal(tape, {help: 'myhelp'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'input',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            type: 'text',
            // aria support
            'aria-describedby': 'myid-tip'
          },
          events: {
            change: base.onChange
          }
        },
        {
          tag: 'span',
          attrs: {
            // aria support
            id: 'myid-tip',
            // aria support
            role: 'tooltip',
            className: {
              'help-block': true
            }
          },
          children: 'myhelp'
        }
      ]
    });
  });

  tape.test('label', function (tape) {
    tape.plan(1);
    equal(tape, {label: 'mylabel'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'label',
          attrs: {
            htmlFor: 'myid',
            className: {
              'control-label': true
            }
          },
          children: 'mylabel'
        },
        {
          tag: 'input',
          attrs: {
            id: 'myid',
            className: {
              'form-control': true
            },
            name: 'myname',
            type: 'text'
          },
          events: {
            change: base.onChange
          }
        }
      ]
    });
  });

  tape.test('placeholder', function (tape) {
    tape.plan(1);
    equal(tape, {placeholder: 'myplaceholder'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text',
          placeholder: 'myplaceholder'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('type', function (tape) {
    tape.plan(1);
    equal(tape, {type: 'password'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'password'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: 'myvalue'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'input',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          type: 'text',
          value: 'myvalue'
        },
        events: {
          change: base.onChange
        }
      }
    });
  });

  // FIXME test config

});
