'use strict';

var test = require('tape');
var t = require('tcomb-validation');
var skin = require('../../lib/skin');
var bootstrap = require('../../lib/skins/bootstrap');
var diff = require('deep-diff').diff;
var compact = require('./compact');
var mixin = t.util.mixin;

test('bootstrap radio()', function (tape) {

  var base = {
    id: 'myid',
    name: 'myname',
    onChange: function () {},
    options: [
      {value: 'M', text: 'Male'},
      {value: 'F', text: 'Female'}
    ]
  };

  var equal = function (tape, locals, expected, showDiff) {
    locals = mixin(mixin({}, base), locals, true);
    locals = new skin.Radio(locals);
    expected = compact(expected);
    var actual = compact(bootstrap.radio(locals));
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
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-M'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'M',
                  name: 'myname',
                  checked: false,
                  id: 'myid-M'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Male'
            ]
          },
          key: 'M'
        },
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-F'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'F',
                  name: 'myname',
                  checked: false,
                  id: 'myid-F'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Female'
            ]
          },
          key: 'F'
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
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true,
              'disabled': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-M'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  disabled: true,
                  type: 'radio',
                  value: 'M',
                  name: 'myname',
                  checked: false,
                  id: 'myid-M'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Male'
            ]
          },
          key: 'M'
        },
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true,
              'disabled': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-F'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  disabled: true,
                  type: 'radio',
                  value: 'F',
                  name: 'myname',
                  checked: false,
                  id: 'myid-F'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Female'
            ]
          },
          key: 'F'
        }
      ]
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
        [
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-M'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'M',
                    name: 'myname',
                    checked: false,
                    id: 'myid-M'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Male'
              ]
            },
            key: 'M'
          },
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-F'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'F',
                    name: 'myname',
                    checked: false,
                    id: 'myid-F'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Female'
              ]
            },
            key: 'F'
          }
        ],
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
        [
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-M'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'M',
                    name: 'myname',
                    checked: false,
                    id: 'myid-M'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Male'
              ]
            },
            key: 'M'
          },
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-F'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'F',
                    name: 'myname',
                    checked: false,
                    id: 'myid-F'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Female'
              ]
            },
            key: 'F'
          }
        ],
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
            id: 'myid',
            className: {
              'control-label': true
            }
          },
          children: 'mylabel'
        },
        [
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-M'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'M',
                    name: 'myname',
                    checked: false,
                    id: 'myid-M',
                    // aria support
                    'aria-describedby': 'myid'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Male'
              ]
            },
            key: 'M'
          },
          {
            tag: 'div',
            attrs: {
              className: {
                'radio': true
              }
            },
            children: {
              tag: 'label',
              attrs: {
                htmlFor: 'myid-F'
              },
              children: [
                {
                  tag: 'input',
                  attrs: {
                    type: 'radio',
                    value: 'F',
                    name: 'myname',
                    checked: false,
                    id: 'myid-F',
                    // aria support
                    'aria-describedby': 'myid'
                  },
                  events: {
                    change: base.onChange
                  }
                },
                ' ',
                'Female'
              ]
            },
            key: 'F'
          }
        ]
      ]
    });
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    equal(tape, {value: 'F'}, {
      tag: 'div',
      attrs: {
        className: {'form-group': true}
      },
      children: [
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-M'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'M',
                  name: 'myname',
                  checked: false,
                  id: 'myid-M'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Male'
            ]
          },
          key: 'M'
        },
        {
          tag: 'div',
          attrs: {
            className: {
              'radio': true
            }
          },
          children: {
            tag: 'label',
            attrs: {
              htmlFor: 'myid-F'
            },
            children: [
              {
                tag: 'input',
                attrs: {
                  type: 'radio',
                  value: 'F',
                  name: 'myname',
                  checked: true,
                  id: 'myid-F'
                },
                events: {
                  change: base.onChange
                }
              },
              ' ',
              'Female'
            ]
          },
          key: 'F'
        }
      ]
    });
  });

  // FIXME test config

});
