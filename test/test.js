"use strict";
var assert = require('assert');
var React = require('react');
var t = require('../index');
var vdom = require('react-vdom');
var Input = require('./Input');

var Str = t.Str;
var struct = t.struct;
var Textbox = t.form.Textbox;
var Select = t.form.Select;
var Form = t.form.Form;

//
// setup
//
var ok = function (x) { assert.strictEqual(true, x); };
var contains = function (s, test) {
  ok(s.indexOf(test) !== -1);
};
var eq = assert.deepEqual;

function dump(dom) {
  console.log(JSON.stringify(dom, null, 2));
}

//
// config
//

t.form.options.inputs = {
  Textbox: Input,
  Select: Input
};

describe('Textbox', function () {

  it('should handle default type', function () {
    var Factory = Textbox(Str);
    var input = Factory();
    var dom = vdom(input);
    eq(dom.children[0][0].attrs.type, 'text');
  });

  it('should handle opts.type', function () {
    var Factory = Textbox(Str, {type: 'textarea', value: 'hello'});
    var input = Factory();
    var dom = vdom(input);
    var s = React.renderComponentToString(input);
    var dom = vdom(input);
    eq(dom.children[0][0].tag, 'textarea');
    eq(dom.children[0][0].children, 'hello');
  });

  it('should handle opts.value', function () {
    var Factory = Textbox(Str, {value: 'hello'});
    var input = Factory();
    var dom = vdom(input);
    eq(dom.children[0][0].attrs.value, 'hello');
  });

});

describe('Select', function () {

  var Country = t.enums({
    IT: 'Italy',
    US: 'United States'
  });

  it('should handle opts.value', function () {
    var Factory = Select(Country, {value: 'US'});
    var input = Factory();
    var dom = vdom(input);
    //dump(dom);
    eq(dom.children[0][0].tag, 'select');
    eq(dom.children[0][0].attrs.value, 'US');
    eq(dom.children[0][0].children, [
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

});

describe('Form', function () {

  it('should handle nested structs', function () {
    var Type = struct({
      a: Str,
      b: Str,
      c: struct({
        d: Str,
        e: Str
      })
    });
    var Factory = Form(Type, {
      a: {value: 'a'},
      b: {value: 'b'},
      c: {
        d: {value: 'd'},
        e: {value: 'e'}
      }
    });
    var input = Factory();
    var dom = vdom(input);
    eq(dom.children[0].children[0][0].attrs.value, 'a');
    eq(dom.children[1].children[0][0].attrs.value, 'b');
    eq(dom.children[2].children[0].children[0][0].attrs.value, 'd');
    eq(dom.children[2].children[1].children[0][0].attrs.value, 'e');
  });

});