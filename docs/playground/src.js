'use strict';

var React = require('react');
var t = require('../../.');

var Any = t.Any;
var Nil = t.Nil;
var Str = t.Str;
var Bool = t.Bool;
var Num = t.Num;
var Obj = t.Obj;
var Func = t.Func;
var Arr = t.Arr;
var irriducible = t.irriducible;
var maybe = t.maybe;
var enums = t.enums;
var list = t.list;
var subtype = t.subtype;
var struct = t.struct;
var create = t.form.create;
var radio = t.form.radio;
var select = t.form.select;

//
// setup
//

// override default fail behaviour of tcomb https://github.com/gcanti/tcomb
t.options.onFail = function (message) {
  throw new Error(message);
};

//
// theme selector
//
var themeSelector = document.getElementById('themeSelector');
var theme = document.getElementById('theme');
themeSelector.onchange = function () {
  theme.href = themeSelector.value;
};

//
// load examples
//

var scripts = [
  {id: 'required', label: 'Required fields'},
  {id: 'optional', label: 'Optional fields'},
  {id: 'numeric', label: 'Numeric fields'},
  {id: 'boolean', label: 'Boolean fields'},
  {id: 'enums', label: 'Enum fields'},
  {id: 'subtype', label: 'Subtypes'},
  {id: 'list', label: 'Lists'},
  {id: 'nested', label: 'Nested structures'},
  {id: 'auto:labels', label: 'Automatically generated labels'},
  {id: 'defaultValue', label: 'Default values'},
  {id: 'label-help', label: 'Fieldset label and help'},
  {id: 'subtype-struct', label: 'Struct subtypes'},
  {id: 'subtype-list', label: 'List subtypes'},
  {id: 'dynamic', label: 'Dynamically create form fields'}
];
var examples = {};
var defaultExample = 'required';
scripts.forEach(function (script, i) {
  examples[script.id] = '// * ' + ((i + 1) + '. ') + script.label + ' *\n\n' + document.getElementById(script.id).innerHTML;
});

var examplesHtml = '<select id="examplesGroup" class="form-control">';
examplesHtml += scripts.map(function (script, i) {
  return '<option' + (script.id === defaultExample ? ' selected="true"' : '') + ' value="' + script.id + '">' + ((i + 1) + '. ') + script.label + '</option>';
}).join('');
examplesHtml += '</select>';
document.getElementById('examples').innerHTML = examplesHtml;

var $code =       document.getElementById('code');
var $preview =    document.getElementById('preview');
var $value =      document.getElementById('value');
var $examples =   document.getElementById('examples');
var POSTFIX =     document.getElementById('postfix').innerHTML;

function renderFactory(factory) {
  React.render(factory(), $preview);
  $value.style.display = 'none';
}

function renderFormValues(value) {
  var html = '<h3>Form values</h3>';
  html += '<pre class="value" style="display: block;">' + JSON.stringify(value, null, 2) + '</pre>';
  $value.style.display = 'block';
  $value.innerHTML = html;
}

function renderError(err) {
  var html = '<h3>Error!</h3>';
  html += '<div class="alert alert-danger">' + err.message + '</div>';
  $value.style.display = 'block';
  $value.innerHTML = html;
}

function run() {
  var code = cm.getValue();
  try {
    var factory = eval(code + POSTFIX);
    renderFactory(React.createFactory(factory));
  } catch (err) {
    renderError(err);
  }
}

var cm = CodeMirror.fromTextArea($code, {
  mode: 'javascript',
  tabSize: 2,
  lineNumbers: false,
  lineWrapping: true,
  smartIndent: false  // javascript mode does bad things with jsx indents
});
cm.setValue(examples[defaultExample]);
cm.on('change', run);

function on(el, name, f) {
  if (el.addEventListener) {
    el.addEventListener(name, f, false);
  } else {
    el.attachEvent('on' + name, f);
  }
}

on($examples, 'change', function () {
  cm.setValue(examples[$examples.value]);
  run();
});

run();
