require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./lib/templates/gridforms":[function(require,module,exports){
'use strict';

//==================
// WORK IN PROGRESS: contributions and PR are welcomed
//==================

//var theme = require('../protocols/theme');

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      defaultValue: locals.value,
      name: locals.name
    },
    events: {
      change: locals.onChange
    }
  };
}

function getLabel(label) {
  if (!label) { return; }
  return {
    tag: 'label',
    children: label
  };
}

function getFormGroup(opts) {
  return {
    tag: 'div',
    attrs: {
      className: {
        'has-error': opts.hasError
      }
    },
    children: opts.children
  };
}

function getOption(opts) {
  return {
    tag: 'option',
    attrs: {
      disabled: opts.disabled,
      value: opts.value
    },
    children: opts.text,
    key: opts.value
  };
}

function getOptGroup(opts) {
  return {
    tag: 'optgroup',
    attrs: {
      disabled: opts.disabled,
      label: opts.label
    },
    children: opts.options.map(getOption),
    key: opts.label
  };
}

function textbox(locals) {

  var type = locals.type;

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  var attrs = {
    name: locals.name,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder,
    defaultValue: locals.value,
    disabled: locals.disabled
  };

  var control = {
    tag: (type === 'textarea') ? 'textarea' : 'input',
    attrs: attrs,
    events: {
      change: locals.onChange
    }
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals.label),
      control
    ]
  });
}

function checkbox() {
  throw new Error('checkboxes are not (yet) supported');
}

function select(locals) {

  var options = locals.options.map(function (x) {
    return !x.label ? getOption(x) : getOptGroup(x);
    //return theme.Option.is(x) ? getOption(x) : getOptGroup(x);
  });

  var control = {
    tag: 'select',
    attrs: {
      name: locals.name,
      defaultValue: locals.defaultValue,
      value: locals.value,
      disabled: locals.disabled
    },
    children: options,
    events: {
      change: locals.onChange
    }
  };

  return getFormGroup({
    hasError: locals.hasError,
    children: [
      getLabel(locals.label),
      control
    ]
  });
}

function radio() {
  throw new Error('radios are not (yet) supported');
}

function struct() {
  throw new Error('In grid forms you must write a custom template for structs');
}

function list() {
  throw new Error('lists are not (yet) supported');
}

module.exports = {
  name: 'gridforms',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

},{}]},{},[]);
