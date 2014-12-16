require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./lib/templates/ionic":[function(require,module,exports){
'use strict';

//==================
// WORK IN PROGRESS: contributions and PR are welcomed
//==================

function getLabel(label) {
  if (!label) { return; }
  return {
    tag: 'span',
    attrs: {
      className: {
        'input-label': true
      }
    },
    children: label
  };
}

function textbox(locals) {

  return {
    tag: 'label',
    attrs: {
      className: {
        'item': true,
        'item-input': true,
        'item-stacked-label': !!locals.label,
        'has-error': locals.hasError
      }
    },
    children: [
      getLabel(locals.label),
      {
        tag: 'input',
        attrs: {
          type: locals.type,
          placeholder: locals.placeholder
        },
        events: {
          change: locals.onChange
        }
      }
    ]
  };

}

function checkbox() {
  throw new Error('checkboxes are not (yet) supported');
}

function select() {
  throw new Error('selects are not (yet) supported');
}

function radio() {
  throw new Error('radios are not (yet) supported');
}

function struct(locals) {

  var rows = locals.order.map(function (name) {
    return locals.inputs.hasOwnProperty(name) ? locals.inputs[name] : name;
  });

  return {
    tag: 'div',
    attrs: {
      className: {
        'list': true
      }
    },
    children: rows
  };
}

function list() {
  throw new Error('lists are not (yet) supported');
}

module.exports = {
  name: 'ionic',
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};

},{}]},{},[]);
