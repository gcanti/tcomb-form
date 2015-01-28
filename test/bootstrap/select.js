'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap select()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    options: [
      {value: '', text: '-'},
      {value: 'M', text: 'Male'},
      {value: 'F', text: 'Female'}
    ]
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Select(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.select(locals));
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
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
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
          tag: 'select',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname'
          },
          events: {
            change: base.onChange
          },
          children: [
            {
              tag: 'option',
              attrs: {
                value: ''
              },
              children: '-',
              key: ''
            },
            {
              tag: 'option',
              attrs: {
                value: 'M'
              },
              children: 'Male',
              key: 'M'
            },
            {
              tag: 'option',
              attrs: {
                value: 'F'
              },
              children: 'Female',
              key: 'F'
            }
          ]
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

  tape.test('disabled', function (tape) {
    tape.plan(1);
    equal(tape, {disabled: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          disabled: true,
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
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
          tag: 'select',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            // aria support
            'aria-describedby': 'myid-tip'
          },
          events: {
            change: base.onChange
          },
          children: [
            {
              tag: 'option',
              attrs: {
                value: ''
              },
              children: '-',
              key: ''
            },
            {
              tag: 'option',
              attrs: {
                value: 'M'
              },
              children: 'Male',
              key: 'M'
            },
            {
              tag: 'option',
              attrs: {
                value: 'F'
              },
              children: 'Female',
              key: 'F'
            }
          ]
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
          tag: 'select',
          attrs: {
            className: {
              'form-control': true
            },
            name: 'myname',
            id: 'myid'
          },
          events: {
            change: base.onChange
          },
          children: [
            {
              tag: 'option',
              attrs: {
                value: ''
              },
              children: '-',
              key: ''
            },
            {
              tag: 'option',
              attrs: {
                value: 'M'
              },
              children: 'Male',
              key: 'M'
            },
            {
              tag: 'option',
              attrs: {
                value: 'F'
              },
              children: 'Female',
              key: 'F'
            }
          ]
        }
      ]
    });
  });

  tape.test('multiple', function (tape) {
    tape.plan(1);
    equal(tape, {multiple: true}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          multiple: true
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
    });
  });

  tape.test('options', function (tape) {
    tape.plan(1);
    equal(tape, {options: [{value: 'a', text: 'b'}]}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: {
          tag: 'option',
          attrs: {
            value: 'a'
          },
          children: 'b',
          key: 'a'
        }
      }
    });
  });

  tape.test('options (disabled)', function (tape) {
    tape.plan(1);
    equal(tape, {options: [{value: 'a', text: 'b', disabled: true}]}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: {
          tag: 'option',
          attrs: {
            value: 'a',
            disabled: true
          },
          children: 'b',
          key: 'a'
        }
      }
    });
  });

  tape.test('optgroup', function (tape) {
    tape.plan(1);
    equal(tape, {options: [
      {label: 'group1', options: [{value: 'a', text: 'b', disabled: true}], disabled: true}
    ]}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname'
        },
        events: {
          change: base.onChange
        },
        children: {
          tag: 'optgroup',
          attrs: {
            label: 'group1',
            disabled: true
          },
          children: {
            tag: 'option',
            attrs: {
              value: 'a',
              disabled: true
            },
            children: 'b',
            key: 'a'
          },
          key: 'group1'
        }
      }
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: 'F'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: {
        tag: 'select',
        attrs: {
          className: {
            'form-control': true
          },
          name: 'myname',
          value: 'F'
        },
        events: {
          change: base.onChange
        },
        children: [
          {
            tag: 'option',
            attrs: {
              value: ''
            },
            children: '-',
            key: ''
          },
          {
            tag: 'option',
            attrs: {
              value: 'M'
            },
            children: 'Male',
            key: 'M'
          },
          {
            tag: 'option',
            attrs: {
              value: 'F'
            },
            children: 'Female',
            key: 'F'
          }
        ]
      }
    });
  });

  // FIXME test config

});
