"use strict";
var assert = require('assert');
var test = require('tape');
var t = require('../index');
var vdom = require('react-vdom');
var React = require('react');

var Str = t.Str;
var Bool = t.Bool;
var Num = t.Num;
var maybe = t.maybe;
var struct = t.struct;
var list = t.list;
var textbox = t.form.textbox;
var select = t.form.select;
var checkbox = t.form.checkbox;
var radio = t.form.radio;
var createForm = t.form.createForm;
var createList = t.form.createList;
var create = t.form.create;

if (typeof window === 'undefined') {

  //
  // Rendering tests
  // uses vdom, mocha and node.js
  //

  //
  // setup
  //
  var ok = function (x) { assert.strictEqual(true, x); };
  var eq = assert.deepEqual;

  var dvdom = function dvdom(input, doDump) {
    var dom = vdom(input);
    if (doDump) {
      console.log(JSON.stringify(dom, null, 2));
    }
    return dom;
  };

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
      var Factory = React.createFactory(textbox(Str));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.tag, 'input');
      eq(dom.children.attrs.type, 'text');
    });

    it('should handle opts.type', function () {
      var Factory = React.createFactory(textbox(Str, {type: 'textarea'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.tag, 'textarea');
    });

    it('should handle opts.i17n', function () {
      var i17n = {
        parse: function (str) {

        },
        format: function (value) {
          return t.Nil.is(value) ? null : new Date(value).toISOString().slice(0, 10);
        }
      };
      var Factory = React.createFactory(textbox(Str, {value: 123472000000, i17n: i17n}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.defaultValue, '1973-11-30');
    });

    it('should handle opts.name', function () {
      var Factory = React.createFactory(textbox(Str, {name: 'mytextbox'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.name, 'mytextbox');
    });

    it('should handle opts.hasError', function () {
      var Factory = React.createFactory(textbox(Str, {hasError: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
    });

    it('should handle opts.message', function () {
      var Factory = React.createFactory(textbox(Str, {message: 'mymessage'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group');
      eq(dom.children.tag, 'input');

      Factory = React.createFactory(textbox(Str, {message: 'mymessage', hasError: true}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[1].attrs.className, 'error-block help-block');
      eq(dom.children[1].children, 'mymessage');

      function message(value) {
        return 'Message for ' + value;
      }
      Factory = React.createFactory(textbox(Str, {message: message, hasError: true, value: 1}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[1].attrs.className, 'error-block help-block');
      eq(dom.children[1].children, 'Message for 1');
    });

    it('should handle opts.value', function () {
      var Factory = React.createFactory(textbox(Str, {value: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.defaultValue, 'hello');
    });

    it('should handle opts.label', function () {
      var Factory = React.createFactory(textbox(Str, {label: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children, 'hello');
    });

    it('should handle opts.help', function () {
      var Factory = React.createFactory(textbox(Str, {help: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[1].tag, 'span');
      eq(dom.children[1].attrs['className'], 'help-block');
      eq(dom.children[1].children, 'hello');
    });

    it('should handle opts.groupClasses', function () {
      var Factory = React.createFactory(textbox(Str, {groupClasses: {'hello': true}}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs['className'], 'form-group hello');
    });

    it('should handle opts.disabled', function () {
      var Factory = React.createFactory(textbox(Str, {disabled: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs['disabled'], true);

      Factory = React.createFactory(textbox(Str, {disabled: true, type: 'textarea'}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.children.attrs['disabled'], true);
    });

    it('should handle opts.readOnly', function () {
      var Factory = React.createFactory(textbox(Str, {readOnly: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs['readOnly'], true);

      Factory = React.createFactory(textbox(Str, {readOnly: true, type: 'textarea'}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.children.attrs['readOnly'], true);
    });

    it('should handle opts.placeholder', function () {
      var Factory = React.createFactory(textbox(Str, {placeholder: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs['placeholder'], 'hello');
    });

    it('should handle opts.addonBefore', function () {
      var Factory = React.createFactory(textbox(Str, {addonBefore: '@'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs['className'], 'input-group');
      eq(dom.children.children[0].tag, 'span');
      eq(dom.children.children[0].attrs['className'], 'input-group-addon');
      eq(dom.children.children[0].children, '@');
    });

    it('should handle opts.addonAfter', function () {
      var Factory = React.createFactory(textbox(Str, {addonAfter: '@'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs['className'], 'input-group');
      eq(dom.children.children[1].tag, 'span');
      eq(dom.children.children[1].attrs['className'], 'input-group-addon');
      eq(dom.children.children[1].children, '@');
    });

    it('should handle i17n', function () {
      var Factory = React.createFactory(textbox(Num, {
        value: 1000,
        i17n: {
          format: function (value) {
            return '1,000';
          },
          parse: function (s) {
            return parseFloat(s, 10);
          }
        }
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.defaultValue, '1,000');
    });

  });

  describe('select', function () {

    var Country = t.enums({
      IT: 'Italy',
      US: 'United States'
    });

    it('should handle opts.hasError', function () {
      var Factory = React.createFactory(select(Country, {hasError: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
    });

    it('should handle opts.message', function () {
      var Factory = React.createFactory(select(Country, {message: 'mymessage'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group');
      eq(dom.children.tag, 'select');

      Factory = React.createFactory(select(Country, {message: 'mymessage', hasError: true}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[1].attrs.className, 'error-block help-block');
      eq(dom.children[1].children, 'mymessage');

      function message(value) {
        return 'Message for ' + value;
      }
      Factory = React.createFactory(select(Country, {message: message, hasError: true, value: 'x'}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[1].attrs.className, 'error-block help-block');
      eq(dom.children[1].children, 'Message for x');
    });

    it('should output a select', function () {
      var Factory = React.createFactory(select(Country, {value: 'US'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.tag, 'select');
      eq(dom.children.children, [
        {
          "tag": "option",
          "attrs": {
            "value": "IT"
          },
          "children": "Italy"
        },
        {
          "tag": "option",
          "attrs": {
            "value": "US"
          },
          "children": "United States"
        }
      ]);
    });

    it('should handle opts.name', function () {
      var Factory = React.createFactory(select(Country, {name: 'myselect'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.name, 'myselect');
    });

    it('should handle opts.value', function () {
      var Factory = React.createFactory(select(Country, {value: 'US'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.defaultValue, 'US');
    });

    it('should handle opts.label', function () {
      var Factory = React.createFactory(select(Country, {label: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children, 'hello');
    });

    it('should handle opts.help', function () {
      var Factory = React.createFactory(select(Country, {help: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[1].tag, 'span');
      eq(dom.children[1].attrs['className'], 'help-block');
      eq(dom.children[1].children, 'hello');
    });

    it('should handle opts.groupClasses', function () {
      var Factory = React.createFactory(select(Country, {groupClasses: {'hello': true}}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs['className'], 'form-group hello');
    });

    it('should handle opts.emptyOption', function () {
      var Factory = React.createFactory(select(Country, {emptyOption: {value: 'myvalue', text: 'mycaption'}}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children[0], {
        "tag": "option",
        "attrs": {
          "value": "myvalue"
        },
        "children": "mycaption"
      });
    });

    it('should handle opts.multiple', function () {
      var Factory = React.createFactory(select(Country, {multiple: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs.multiple, true);
    });

    it('should handle opts.order', function () {
      var Factory = React.createFactory(select(Country, {order: 'desc', emptyOption: {value: 'myvalue', text: 'mycaption'}}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children, [
        {
          "tag": "option",
          "attrs": {
            "value": "myvalue"
          },
          "children": "mycaption"
        },
        {
          "tag": "option",
          "attrs": {
            "value": "US"
          },
          "children": "United States"
        },
        {
          "tag": "option",
          "attrs": {
            "value": "IT"
          },
          "children": "Italy"
        }
      ]);
    });

    it('should handle opts.disabled', function () {
      var Factory = React.createFactory(select(Country, {disabled: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.attrs['disabled'], true);
    });

    it('should handle opts.options', function () {
      var Factory = React.createFactory(select(Country, {
        options: [
          {value: 'US', text: 'US'},
          {value: 'IT', text: 'IT'}
        ]
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children, [
        {
          "tag": "option",
          "attrs": {
            "value": "US"
          },
          "children": "US"
        },
        {
          "tag": "option",
          "attrs": {
            "value": "IT"
          },
          "children": "IT"
        }
      ]);
    });

    it('should handle grouped options', function () {
      var Factory = React.createFactory(select(Country, {
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
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children, [
        {
          "tag": "option",
          "attrs": {
            "value": "value5"
          },
          "children": "description5"
        },
        {
          "tag": "optgroup",
          "attrs": {
            "label": "group1"
          },
          "children": [
            {
              "tag": "option",
              "attrs": {
                "value": "value1"
              },
              "children": "description1"
            },
            {
              "tag": "option",
              "attrs": {
                "value": "value3"
              },
              "children": "description3"
            }
          ]
        },
        {
          "tag": "optgroup",
          "attrs": {
            "label": "group2"
          },
          "children": [
            {
              "tag": "option",
              "attrs": {
                "value": "value4"
              },
              "children": "description4"
            },
            {
              "tag": "option",
              "attrs": {
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
      var Factory = React.createFactory(checkbox(Bool, {value: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children.children[0].attrs.defaultChecked, true);
    });

    it('should handle opts.hasError', function () {
      var Factory = React.createFactory(checkbox(Bool, {hasError: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
    });

    it('should handle opts.message', function () {
      var Factory = React.createFactory(checkbox(Bool, {message: 'mymessage'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group');
      eq(dom.children.tag, 'div');

      Factory = React.createFactory(checkbox(Bool, {message: 'mymessage', hasError: true}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[1].attrs.className, 'error-block help-block');
      eq(dom.children[1].children, 'mymessage');

      function message(value) {
        return 'Message for ' + value;
      }
      Factory = React.createFactory(checkbox(Bool, {message: message, hasError: true, value: 'x'}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[1].attrs.className, 'error-block help-block');
      eq(dom.children[1].children, 'Message for x');
    });

    it('should handle opts.name', function () {
      var Factory = React.createFactory(checkbox(Bool, {name: 'mycheckbox'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children.children[0].attrs.name, 'mycheckbox');
    });

    it('should handle opts.label', function () {
      var Factory = React.createFactory(checkbox(Bool, {label: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children.children[2], 'hello');
    });

    it('should handle opts.help', function () {
      var Factory = React.createFactory(checkbox(Bool, {help: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[1].tag, 'span');
      eq(dom.children[1].attrs['className'], 'help-block');
      eq(dom.children[1].children, 'hello');
    });

    it('should handle opts.groupClasses', function () {
      var Factory = React.createFactory(checkbox(Bool, {groupClasses: {'hello': true}}));
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
      var Factory = React.createFactory(radio(Country, {value: 'US'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[1].children.children[0].attrs.defaultChecked, true);
    });

    it('should handle opts.hasError', function () {
      var Factory = React.createFactory(radio(Country, {hasError: true}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
    });

    it('should handle opts.message', function () {
      var Factory = React.createFactory(radio(Country, {message: 'mymessage'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.attrs.className, 'form-group');
      eq(dom.children.length, 2);

      Factory = React.createFactory(radio(Country, {message: 'mymessage', hasError: true}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[2].attrs.className, 'error-block help-block');
      eq(dom.children[2].children, 'mymessage');

      function message(value) {
        return 'Message for ' + value;
      }
      Factory = React.createFactory(radio(Country, {message: message, hasError: true, value: 'x'}));
      input = Factory();
      dom = dvdom(input);
      eq(dom.attrs.className, 'form-group has-error');
      eq(dom.children[2].attrs.className, 'error-block help-block');
      eq(dom.children[2].children, 'Message for x');
    });

    it('should handle opts.name', function () {
      var Factory = React.createFactory(radio(Country, {name: 'myradio'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children.children[0].attrs.name, 'myradio');
      eq(dom.children[1].children.children[0].attrs.name, 'myradio');
    });

    it('should handle opts.label', function () {
      var Factory = React.createFactory(radio(Country, {label: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children, 'hello');
    });

    it('should handle opts.help', function () {
      var Factory = React.createFactory(radio(Country, {help: 'hello'}));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[2].tag, 'span');
      eq(dom.children[2].attrs['className'], 'help-block');
      eq(dom.children[2].children, 'hello');
    });

    it('should handle opts.groupClasses', function () {
      var Factory = React.createFactory(radio(Country, {groupClasses: {'hello': true}}));
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

    var Person = struct({
      name: Str,
      surname: maybe(Str),
      country: Country
    });

    var i18n = {
      select: 'Seleziona ',
      optional: ' (opzionale)',
      add: 'Aggiungi',
      remove: 'Elimina',
      up: 'Su',
      down: 'Giù'
    };

    it('should handle opts.bundle', function () {
      var Factory = React.createFactory(createForm(Person, {
        i18n: i18n
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[1].children.attrs.placeholder, 'Surname (opzionale)');
      eq(dom.children[2].children.children[0].children, 'Seleziona country');
    });

    it('should return fieldset as tag container', function () {
      var Factory = React.createFactory(createForm(Person));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.tag, 'fieldset');
    });

    it('should handle opts.auto = "placeholders"', function () {
      var Factory = React.createFactory(createForm(User, {
        order: ['requiredStr', 'optionalStr', 'bool', 'requiredEnum', 'optionalEnum', 'requiredRadio', 'optionalRadio'],
        fields: {
          requiredRadio: {input: t.form.radio},
          optionalRadio: {input: t.form.radio}
        }
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children.attrs.placeholder, 'Required str');
      eq(dom.children[1].children.attrs.placeholder, 'Optional str (optional)');
      eq(dom.children[2].children.children.children[2].children, 'Bool');
      eq(dom.children[3].children.children[0].children, 'Select your required enum');
      eq(dom.children[4].children.children[0].children, 'Select your optional enum (optional)');
      eq(dom.children[5].children[0].children.children, 'Required radio');
      eq(dom.children[6].children[0].children.children[0], 'Optional radio');
      eq(dom.children[6].children[0].children.children[1].children, ' (optional)');
    });

    it('should handle opts.auto = "labels"', function () {
      var Factory = React.createFactory(createForm(User, {
        auto: 'labels',
        order: ['requiredStr', 'optionalStr', 'bool', 'requiredEnum', 'optionalEnum', 'requiredRadio', 'optionalRadio'],
        fields: {
          requiredRadio: {input: t.form.radio},
          optionalRadio: {input: t.form.radio}
        }
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children[0].children.children, 'Required str');
      eq(dom.children[1].children[0].children.children[0], 'Optional str');
      eq(dom.children[1].children[0].children.children[1].children, ' (optional)');
      eq(dom.children[2].children.children.children[2].children, 'Bool');
      eq(dom.children[3].children[0].children.children, 'Required enum');
      eq(dom.children[4].children[0].children.children[0], 'Optional enum');
      eq(dom.children[5].children[0].children.children, 'Required radio');
      eq(dom.children[6].children[0].children.children[0], 'Optional radio');
    });

    it('should handle opts.auto = "none"', function () {
      var Factory = React.createFactory(createForm(User, {
        auto: 'none',
        order: ['requiredStr', 'optionalStr', 'bool', 'requiredEnum', 'optionalEnum', 'requiredRadio', 'optionalRadio'],
        fields: {
          requiredRadio: {input: t.form.radio},
          optionalRadio: {input: t.form.radio}
        }
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children.tag, 'input');
      eq(dom.children[1].children.tag, 'input');
      eq(dom.children[2].children.children.children[2].children, 'Bool');
      eq(dom.children[3].children.tag, 'select');
      eq(dom.children[4].children.tag, 'select');
      eq(dom.children[5].children[0].children.children, 'Required radio');
      eq(dom.children[6].children[0].children.children[0], 'Optional radio');
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
      var Factory = React.createFactory(createForm(Type, {
        order: ['a', 'b', 'c'],
        value: {
          a: 'a',
          b: 'b',
          c: {
            d: 'd',
            e: 'e'
          }
        }
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children.attrs.defaultValue, 'a');
      eq(dom.children[1].children.attrs.defaultValue, 'b');
      eq(dom.children[2].children[1].children.attrs.defaultValue, 'd');
      eq(dom.children[2].children[2].children.attrs.defaultValue, 'e');
    });

  });

  describe('createList', function () {

    var Tags = list(Str);

    var i18n = {
      select: 'Seleziona ',
      optional: ' (opzionale)',
      add: 'Aggiungi',
      remove: 'Elimina',
      up: 'Su',
      down: 'Giù'
    };

    it('should return fieldset as tag container', function () {
      var Factory = React.createFactory(createList(Tags));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.tag, 'fieldset');
    });

    it('should handle opts.bundle', function () {
      var Factory = React.createFactory(createList(Tags, {
        value: ['mytag'],
        i18n: i18n
      }));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children[1].children.children[0].children, 'Elimina');
      eq(dom.children[0].children[1].children.children[1].children, 'Su');
      eq(dom.children[0].children[1].children.children[2].children, 'Giù');
    });

  });

  describe('create', function () {

    var Person = struct({
      name: Str,
      surname: Str
    });

    it('should handle structs', function () {
      var Factory = React.createFactory(create(Person));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children[0].children.attrs.placeholder, 'Name');
      eq(dom.children[1].children.attrs.placeholder, 'Surname');
    });

    it('should handle lists', function () {
      var Factory = React.createFactory(create(list(Str)));
      var input = Factory();
      var dom = dvdom(input);
      eq(dom.children.children.children, 'Add');
    });

  });

} else {

  //
  // getValue tests
  // uses tape and a real captured browser
  //

  var getFormValue = function getFormValue(type, options) {
    var Form = React.createFactory(createForm(type, options));
    var node = document.createElement('div');
    document.body.appendChild(node);
    var form = React.render(Form(), node);
    return form.getValue();
  };

  test('required fields', function (tape) {
    tape.plan(3);
    var Person = struct({
      name: Str,
      surname: Str
    });
    tape.deepEqual(null, getFormValue(Person));
    var value = {
      name: 'giulio',
    };
    tape.deepEqual(null, getFormValue(Person, {value: value}));
    value = {
      name: 'giulio',
      surname: 'canti'
    };
    tape.deepEqual(value, getFormValue(Person, {value: value}));
  });

  test('optional fields', function (tape) {
    tape.plan(3);
    var Person = struct({
      name: maybe(Str),
      surname: maybe(Str)
    });
    tape.deepEqual({name: null, surname: null}, getFormValue(Person));
    var value = {
      name: 'giulio',
    };
    tape.deepEqual({name: 'giulio', surname: null}, getFormValue(Person, {value: value}));
    value = {
      name: 'giulio',
      surname: 'canti'
    };
    tape.deepEqual(value, getFormValue(Person, {value: value}));
  });

}

