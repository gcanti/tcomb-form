'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap checkbox()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    label: 'mylabel',
    value: false
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Checkbox(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.checkbox(locals));
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
        tag: 'div',
        attrs: {
          className: {
            'checkbox': true
          }
        },
        children: {
          tag: 'label',
          attrs: {
            htmlFor: 'myid'
          },
          children: [
            {
              tag: 'input',
              attrs: {
                type: 'checkbox',
                name: 'myname',
                checked: false,
                id: 'myid'
              },
              events: {
                change: base.onChange
              }
            },
            ' ',
            'mylabel'
          ]
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
        tag: 'div',
        attrs: {
          className: {
            'checkbox': true,
            'disabled': true
          }
        },
        children: {
          tag: 'label',
          attrs: {
            htmlFor: 'myid'
          },
          children: [
            {
              tag: 'input',
              attrs: {
                disabled: true,
                type: 'checkbox',
                name: 'myname',
                checked: false,
                id: 'myid'
              },
              events: {
                change: base.onChange
              }
            },
            ' ',
            'mylabel'
          ]
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
          tag: 'div',
          attrs: {
            className: {
              'checkbox': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'checkbox',
                  name: 'myname',
                  checked: false,
                  id: 'myid'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'mylabel'
            ]
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
          tag: 'div',
          attrs: {
            className: {
              'checkbox': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'checkbox',
                  name: 'myname',
                  checked: false,
                  id: 'myid'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'mylabel'
            ]
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

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'div',
        attrs: {
          className: {
            'checkbox': true
          }
        },
        children: {
          tag: 'label',
          attrs: {
            htmlFor: 'myid'
          },
          children: [
            {
              tag: 'input',
              attrs: {
                type: 'checkbox',
                name: 'myname',
                checked: true,
                id: 'myid'
              },
              events: {
                change: base.onChange
              }
            },
            ' ',
            'mylabel'
          ]
        }
      }
    });
  });

  // FIXME test config

});
