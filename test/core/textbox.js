'use strict';

var React = require('react');
var test = require('tape');
var vdom = require('react-vdom');
var t = require('../../.');
var Context = require('../../lib/protocols/api').Context;
var config = require('../../lib/config');
var getReport = require('../../lib/util/getReport');
var bootstrap = require('../../lib/templates/bootstrap');
var Textbox = require('../../lib/protocols/theme').Textbox;
var textbox = require('../../lib/factories').textbox;

//
// helpers
//

function getContext(ctx) {

  ctx = t.util.mixin({
    templates: config.templates,
    i18n: config.i18n,
    report: getReport(ctx.type),
    name: 'leaf',
    auto: 'placeholders',
    label: 'default label'
  }, ctx, true);

  return new Context(ctx);
}

function getLocals(ctx, opts) {
  var Component = textbox(opts, getContext(ctx));
  vdom(React.createElement(Component)); // force render()
}

function getResult(ctx, opts, onResult, onRender) {
  var rendered = false;
  opts.template = function (locals) {
    if (rendered && onRender) {
      onRender(locals);
    }
    return bootstrap.textbox(locals);
  };
  ctx = getContext(ctx);
  var Component = React.createFactory(textbox(opts, ctx));
  var node = document.createElement('div');
  document.body.appendChild(node);
  var component = React.render(Component(), node);
  rendered = true;
  var result = component.getValue();
  onResult(result);
}

//
// rendering tests
//

test('textbox() factory', function (tape) {

  tape.test('type', function (tape) {
    tape.plan(3);

    // the default should be `text`
    getLocals({type: t.Str}, {template: function (locals) {
      tape.ok(locals instanceof Textbox);
      tape.deepEqual(locals.type, 'text');
    }});

    // should handle a custom type
    getLocals({type: t.Str}, {type: 'hidden', template: function (locals) {
      tape.deepEqual(locals.type, 'hidden');
    }});
  });

  tape.test('disabled', function (tape) {
    tape.plan(2);

    getLocals({type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.disabled, null);
    }});

    getLocals({type: t.Str}, {disabled: true, template: function (locals) {
      tape.deepEqual(locals.disabled, true);
    }});
  });

  tape.test('placeholder', function (tape) {
    tape.plan(3);

    // should have a default placeholder
    getLocals({type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.placeholder, 'default label');
    }});

    // should handle optional
    getLocals({type: t.maybe(t.Str)}, {template: function (locals) {
      tape.deepEqual(locals.placeholder, 'default label (optional)');
    }});

    // should handle a custom placeholder
    getLocals({type: t.maybe(t.Str)}, {placeholder: 'my placeholder', template: function (locals) {
      tape.deepEqual(locals.placeholder, 'my placeholder');
    }});
  });

  tape.test('label', function (tape) {
    tape.plan(5);

    // labels override placeholders
    getLocals({type: t.Str}, {label: 'mylabel', placeholder: 'my placeholder', template: function (locals) {
      tape.deepEqual(locals.placeholder, null);
    }});

    // labels as strings
    getLocals({type: t.Str}, {label: 'mylabel', template: function (locals) {
      tape.deepEqual(locals.label, 'mylabel');
    }});

    // labels as JSX
    getLocals({type: t.Str}, {label: React.DOM.i(null, 'JSX label'), template: function (locals) {
      tape.deepEqual(vdom(locals.label), {tag: 'i', attrs: {}, children: 'JSX label'});
    }});

    // should have a default label if ctx.auto = `labels`
    getLocals({type: t.Str, auto: 'labels'}, {template: function (locals) {
      tape.deepEqual(locals.label, 'default label');
    }});

    // should handle optional
    getLocals({type: t.maybe(t.Str), auto: 'labels'}, {template: function (locals) {
      tape.deepEqual(locals.label, 'default label (optional)');
    }});

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    // helps as strings
    getLocals({type: t.Str}, {help: 'my help', template: function (locals) {
      tape.deepEqual(locals.help, 'my help');
    }});

    // helps as JSX
    getLocals({type: t.Str}, {help: React.DOM.i(null, 'JSX help'), template: function (locals) {
      tape.deepEqual(vdom(locals.help), {tag: 'i', attrs: {}, children: 'JSX help'});
    }});
  });

  tape.test('name', function (tape) {
    tape.plan(2);

    // should have a default name
    getLocals({type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.name, 'leaf');
    }});

    // should handle a custom name
    getLocals({type: t.Str}, {name: 'myname', template: function (locals) {
      tape.deepEqual(locals.name, 'myname');
    }});
  });

  tape.test('value', function (tape) {
    tape.plan(2);

    // should receive a value from the context
    getLocals({type: t.Str, value: 'a'}, {template: function (locals) {
      tape.deepEqual(locals.value, 'a');
    }});

    // a value specified in opts should override the context one
    getLocals({type: t.Str, value: 'a'}, {value: 'b', template: function (locals) {
      tape.deepEqual(locals.value, 'b');
    }});

  });

  tape.test('transformer', function (tape) {
    tape.plan(2);

    // should have a default transformer based on the inner type
    getLocals({type: t.maybe(t.Num)}, {value: 1, template: function (locals) {
      tape.deepEqual(locals.value, '1');
    }});

    // should handle a custom transformer
    var transformer = {
      format: function (value) {
        return value.join(',');
      },
      parse: function (value) {
        return value.split(',');
      }
    };
    getLocals({type: t.Str}, {value: ['a', 'b'], transformer: transformer, template: function (locals) {
      tape.deepEqual(locals.value, 'a,b');
    }});

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    getLocals({type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
    }});
    getLocals({type: t.Str}, {hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
    }});

  });

  tape.test('error', function (tape) {
    tape.plan(10);

    getLocals({type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    getLocals({type: t.Str}, {error: 'my error', template: function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.error, null);
    }});

    // error as a string
    getLocals({type: t.Str}, {error: 'my error', hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'my error');
    }});

    // error as a JSX
    getLocals({type: t.Str}, {error: React.DOM.i(null, 'JSX error'), hasError: true, template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(vdom(locals.error), {tag: 'i', attrs: {}, children: 'JSX error'});
    }});

    // error as a function
    var getError = function (value) {
      return 'error: ' + value;
    };
    getLocals({type: t.Str}, {error: getError, hasError: true, value: 'a', template: function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.error, 'error: a');
    }});

  });

  tape.test('template', function (tape) {
    tape.plan(1);

    // should receive a default template form the context
    getLocals({type: t.Str, templates: {textbox: function (locals) {
      tape.ok(true);
    }}});

  });

  tape.test('id', function (tape) {
    tape.plan(2);

    getLocals({type: t.Str}, {id: 'myid', template: function (locals) {
      tape.deepEqual(locals.id, 'myid');
    }});

    // should fallback on this._rootNodeID
    getLocals({type: t.Str}, {template: function (locals) {
      tape.deepEqual(locals.id && t.Str.is(locals.id) && locals.id.length > 0, true);
    }});

  });

});

//
// getValue() tests (browser required)
//

if (typeof window !== 'undefined') {

  test('textbox getValue()', function (tape) {
    tape.plan(36);

    var Password = t.subtype(t.Str, function (s) {
      return s.length >= 3;
    });

    getResult({type: t.Str}, {}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, null);
    }, function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.value, null);
    });

    getResult({type: t.Str}, {value: 'a'}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, 'a');
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, 'a');
    });

    getResult({type: t.maybe(t.Str)}, {}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, null);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, null);
    });

    getResult({type: t.maybe(t.Str)}, {value: 'a'}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, 'a');
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, 'a');
    });

    getResult({type: Password}, {}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, null);
    }, function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.value, null);
    });

    getResult({type: t.maybe(Password)}, {}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, null);
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, null);
    });

    getResult({type: Password}, {value: 'a'}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, 'a');
    }, function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.value, 'a');
    });

    getResult({type: Password}, {value: 'aaa'}, function (result) {
      tape.deepEqual(result.isValid(), true);
      tape.deepEqual(result.value, 'aaa');
    }, function (locals) {
      tape.deepEqual(locals.hasError, false);
      tape.deepEqual(locals.value, 'aaa');
    });

    // should handle spaces
    getResult({type: t.Str}, {value: ' '}, function (result) {
      tape.deepEqual(result.isValid(), false);
      tape.deepEqual(result.value, null);
    }, function (locals) {
      tape.deepEqual(locals.hasError, true);
      tape.deepEqual(locals.value, null);
    });

    // FIXME test hidden textbox

  });

}
