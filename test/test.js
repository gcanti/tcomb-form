"use strict";
var assert = require('assert');
var t = require('../index');
var vdom = require('react-vdom');

var Str = t.Str;
var Bool = t.Bool;
var Num = t.Num;
var maybe = t.maybe;
var struct = t.struct;
var textbox = t.form.textbox;
var select = t.form.select;
var checkbox = t.form.checkbox;
var radio = t.form.radio;
var createForm = t.form.createForm;

//
// setup
//
var ok = function (x) { assert.strictEqual(true, x); };
var eq = assert.deepEqual;

function dump(dom) {
  console.log(JSON.stringify(dom, null, 2));
}

function dvdom(input, doDump) {
  var dom = vdom(input);
  if (doDump) {
    dump(dom);
  }
  return dom;
}

describe('humanize', function () {

  var humanize = t.form.util.humanize;

  it('should humanize labels', function () {
    eq(humanize('username'), 'Username');
    eq(humanize('rememberMe'), 'Remember me');
    eq(humanize('remember_me'), 'Remember me');
  });

});

describe('textbox', function () {

  it('should handle default type', function () {
    var Factory = textbox(Str);
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].tag, 'input');
    eq(dom.children[0].attrs.type, 'text');
  });

  it('should handle opts.type', function () {
    var Factory = textbox(Str, {type: 'textarea'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].tag, 'textarea');
  });

  it('should handle opts.value', function () {
    var Factory = textbox(Str, {value: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs.value, 'hello');
  });

  it('should handle opts.label', function () {
    var Factory = textbox(Str, {label: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children, 'hello');
  });

  it('should handle opts.help', function () {
    var Factory = textbox(Str, {help: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[1].tag, 'span');
    eq(dom.children[1].attrs['className'], 'help-block');
    eq(dom.children[1].children, 'hello');
  });

  it('should handle opts.groupClasses', function () {
    var Factory = textbox(Str, {groupClasses: {'hello': true}});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.attrs['className'], 'form-group hello');
  });

  it('should handle opts.disabled', function () {
    var Factory = textbox(Str, {disabled: true});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs['disabled'], true);

    Factory = textbox(Str, {disabled: true, type: 'textarea'});
    input = Factory();
    dom = dvdom(input);
    eq(dom.children[0].attrs['disabled'], true);
  });

  it('should handle opts.readOnly', function () {
    var Factory = textbox(Str, {readOnly: true});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs['readOnly'], true);

    Factory = textbox(Str, {readOnly: true, type: 'textarea'});
    input = Factory();
    dom = dvdom(input);
    eq(dom.children[0].attrs['readOnly'], true);
  });

  it('should handle opts.placeholder', function () {
    var Factory = textbox(Str, {placeholder: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs['placeholder'], 'hello');
  });

  it('should handle opts.addonBefore', function () {
    var Factory = textbox(Str, {addonBefore: '@'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs['className'], 'input-group');
    eq(dom.children[0].children[0].tag, 'span');
    eq(dom.children[0].children[0].attrs['className'], 'input-group-addon');
    eq(dom.children[0].children[0].children, '@');
  });

  it('should handle opts.addonAfter', function () {
    var Factory = textbox(Str, {addonAfter: '@'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs['className'], 'input-group');
    eq(dom.children[0].children[1].tag, 'span');
    eq(dom.children[0].children[1].attrs['className'], 'input-group-addon');
    eq(dom.children[0].children[1].children, '@');
  });

  it('should handle i17n', function () {
    var Factory = textbox(Num, {
      value: 1000,
      i17n: {
        format: function (value) {
          return '1,000';
        },
        parse: function (s) {
          return parseFloat(s, 10);
        }
      }
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs.value, '1,000');
  });

});

describe('select', function () {

  var Country = t.enums({
    IT: 'Italy',
    US: 'United States'
  });

  it('should output a select', function () {
    var Factory = select(Country, {value: 'US'});
    var input = Factory();
    var dom = dvdom(input);
    //dump(dom);
    eq(dom.children[0].tag, 'select');
    eq(dom.children[0].children, [
      {
        "tag": "option",
        "attrs": {
          "key": 0,
          "value": "IT"
        },
        "children": "Italy"
      },
      {
        "tag": "option",
        "attrs": {
          "key": 1,
          "value": "US"
        },
        "children": "United States"
      }
    ]);
  });

  it('should handle opts.value', function () {
    var Factory = select(Country, {value: 'US'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs.defaultValue, 'US');
  });

  it('should handle opts.label', function () {
    var Factory = select(Country, {label: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children, 'hello');
  });

  it('should handle opts.help', function () {
    var Factory = select(Country, {help: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[1].tag, 'span');
    eq(dom.children[1].attrs['className'], 'help-block');
    eq(dom.children[1].children, 'hello');
  });

  it('should handle opts.groupClasses', function () {
    var Factory = select(Country, {groupClasses: {'hello': true}});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.attrs['className'], 'form-group hello');
  });

  it('should handle opts.emptyOption', function () {
    var Factory = select(Country, {emptyOption: {value: 'myvalue', text: 'mycaption'}});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children[0], {
      "tag": "option",
      "attrs": {
        "key": 0,
        "value": "myvalue"
      },
      "children": "mycaption"
    });
  });

  it('should handle opts.order', function () {
    var Factory = select(Country, {order: 'desc', emptyOption: {value: 'myvalue', text: 'mycaption'}});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children, [
      {
        "tag": "option",
        "attrs": {
          "key": 0,
          "value": "myvalue"
        },
        "children": "mycaption"
      },
      {
        "tag": "option",
        "attrs": {
          "key": 1,
          "value": "US"
        },
        "children": "United States"
      },
      {
        "tag": "option",
        "attrs": {
          "key": 2,
          "value": "IT"
        },
        "children": "Italy"
      }
    ]);
  });

  it('should handle opts.disabled', function () {
    var Factory = select(Country, {disabled: true});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].attrs['disabled'], true);
  });

  it('should handle opts.options', function () {
    var Factory = select(Country, {
      options: [
        {value: 'US', text: 'US'},
        {value: 'IT', text: 'IT'}
      ]
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children, [
      {
        "tag": "option",
        "attrs": {
          "key": 0,
          "value": "US"
        },
        "children": "US"
      },
      {
        "tag": "option",
        "attrs": {
          "key": 1,
          "value": "IT"
        },
        "children": "IT"
      }
    ]);
  });

  it('should handle grouped options', function () {
    var Factory = select(Country, {
      options: [
        {value: 'value5', text: 'description5'}, // an option
        {group: 'group1', options: [ // a group of options
          {value: 'value1', text: 'description1'},
          {value: 'value3', text: 'description3'}
        ]},
        {group: 'group2', options: [ // another group of options
          {value: 'value4', text: 'description4'},
          {value: 'value2', text: 'description2'}
        ]}
      ]
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children, [
      {
        "tag": "option",
        "attrs": {
          "key": 0,
          "value": "value5"
        },
        "children": "description5"
      },
      {
        "tag": "optgroup",
        "attrs": {
          "label": "group1",
          "key": 1
        },
        "children": [
          {
            "tag": "option",
            "attrs": {
              "key": "1-0",
              "value": "value1"
            },
            "children": "description1"
          },
          {
            "tag": "option",
            "attrs": {
              "key": "1-1",
              "value": "value3"
            },
            "children": "description3"
          }
        ]
      },
      {
        "tag": "optgroup",
        "attrs": {
          "label": "group2",
          "key": 2
        },
        "children": [
          {
            "tag": "option",
            "attrs": {
              "key": "2-0",
              "value": "value4"
            },
            "children": "description4"
          },
          {
            "tag": "option",
            "attrs": {
              "key": "2-1",
              "value": "value2"
            },
            "children": "description2"
          }
        ]
      }
    ]);
  });

});

describe('checkbox', function () {

  it('should handle opts.value', function () {
    var Factory = checkbox(Bool, {value: true});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children.children[0].attrs.checked, true);
  });

  it('should handle opts.label', function () {
    var Factory = checkbox(Bool, {label: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children.children[2], 'hello');
  });

  it('should handle opts.help', function () {
    var Factory = checkbox(Bool, {help: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[1].tag, 'span');
    eq(dom.children[1].attrs['className'], 'help-block');
    eq(dom.children[1].children, 'hello');
  });

  it('should handle opts.groupClasses', function () {
    var Factory = checkbox(Bool, {groupClasses: {'hello': true}});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.attrs['className'], 'form-group hello');
  });

});

describe('radio', function () {

  var Country = t.enums({
    IT: 'Italy',
    US: 'United States'
  });

  it('should handle opts.value', function () {
    var Factory = radio(Country, {value: 'US'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0][1].children.children[0].attrs.checked, true);
  });

  it('should handle opts.label', function () {
    var Factory = radio(Country, {label: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0].children, 'hello');
  });

  it('should handle opts.help', function () {
    var Factory = radio(Country, {help: 'hello'});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[1].tag, 'span');
    eq(dom.children[1].attrs['className'], 'help-block');
    eq(dom.children[1].children, 'hello');
  });

  it('should handle opts.groupClasses', function () {
    var Factory = radio(Country, {groupClasses: {'hello': true}});
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.attrs['className'], 'form-group hello');
  });

});

describe('createForm', function () {

  var Country = t.enums({
    IT: 'Italy',
    US: 'United States'
  });

  var User = struct({
    requiredStr: Str,
    optionalStr: maybe(Str),
    bool: Bool,
    requiredEnum: Country,
    optionalEnum: maybe(Country),
    requiredRadio: Country,
    optionalRadio: maybe(Country)
  });

  it('should handle opts.auto = "placeholders"', function () {
    var Factory = createForm(User, {
      order: ['requiredStr', 'optionalStr', 'bool', 'requiredEnum', 'optionalEnum', 'requiredRadio', 'optionalRadio'],
      fields: {
        requiredRadio: {input: t.form.radio},
        optionalRadio: {input: t.form.radio}
      }
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0][0].children[0].attrs.placeholder, 'Required str');
    eq(dom.children[0][1].children[0].attrs.placeholder, 'Optional str (optional)');
    eq(dom.children[0][2].children[0].children.children[2].children, 'Bool');
    eq(dom.children[0][3].children[0].children[0].children, 'Select your required enum');
    eq(dom.children[0][4].children[0].children[0].children, 'Select your optional enum (optional)');
    eq(dom.children[0][5].children[0].children.children, 'Required radio');
    eq(dom.children[0][6].children[0].children.children[0], 'Optional radio');
    eq(dom.children[0][6].children[0].children.children[1].children, ' (optional)');
  });

  it('should handle opts.auto = "labels"', function () {
    var Factory = createForm(User, {
      auto: 'labels',
      order: ['requiredStr', 'optionalStr', 'bool', 'requiredEnum', 'optionalEnum', 'requiredRadio', 'optionalRadio'],
      fields: {
        requiredRadio: {input: t.form.radio},
        optionalRadio: {input: t.form.radio}
      }
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0][0].children[0].children.children, 'Required str');
    eq(dom.children[0][1].children[0].children.children[0], 'Optional str');
    eq(dom.children[0][1].children[0].children.children[1].children, ' (optional)');
    eq(dom.children[0][2].children[0].children.children[2].children, 'Bool');
    eq(dom.children[0][3].children[0].children.children, 'Required enum');
    eq(dom.children[0][4].children[0].children.children[0], 'Optional enum');
    eq(dom.children[0][5].children[0].children.children, 'Required radio');
    eq(dom.children[0][6].children[0].children.children[0], 'Optional radio');
  });

  it('should handle opts.auto = "none"', function () {
    var Factory = createForm(User, {
      auto: 'none',
      order: ['requiredStr', 'optionalStr', 'bool', 'requiredEnum', 'optionalEnum', 'requiredRadio', 'optionalRadio'],
      fields: {
        requiredRadio: {input: t.form.radio},
        optionalRadio: {input: t.form.radio}
      }
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0][0].children[0].tag, 'input');
    eq(dom.children[0][1].children[0].tag, 'input');
    eq(dom.children[0][2].children[0].children.children[2].children, 'Bool');
    eq(dom.children[0][3].children[0].tag, 'select');
    eq(dom.children[0][4].children[0].tag, 'select');
    eq(dom.children[0][5].children[0].children.children, 'Required radio');
    eq(dom.children[0][6].children[0].children.children[0], 'Optional radio');
  });

  it('should handle opts.value', function () {
    var Type = struct({
      a: Str,
      b: Str,
      c: struct({
        d: Str,
        e: Str
      })
    });
    var Factory = createForm(Type, {
      order: ['a', 'b', 'c'],
      value: {
        a: 'a',
        b: 'b',
        c: {
          d: 'd',
          e: 'e'
        }
      }
    });
    var input = Factory();
    var dom = dvdom(input);
    eq(dom.children[0][0].children[0].attrs.value, 'a');
    eq(dom.children[0][1].children[0].attrs.value, 'b');
    eq(dom.children[0][2].children[1][0].children[0].attrs.value, 'd');
    eq(dom.children[0][2].children[1][1].children[0].attrs.value, 'e');
  });

});