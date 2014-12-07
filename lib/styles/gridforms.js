'use strict';

//==================
// WORK IN PROGRESS
//==================

var React = require('react');
var style = require('../protocols/style');
var cx = require('react/lib/cx');

module.exports = {
  name: 'gridforms',
  textbox: textboxTemplate,
  checkbox: checkboxTemplate,
  select: selectTemplate,
  radio: radioTemplate,
  struct: structTemplate,
  list: listTemplate
};

function textboxTemplate(locals) {

  var type = locals.type;

  if (type === 'hidden') {
    return <input
      type="hidden"
      name={locals.name}
      defaultValue={locals.value}
      ref={locals.ref}/>;
  }

  var attrs = {
    name: locals.name,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder,
    defaultValue: locals.value,
    readOnly: locals.readOnly,
    disabled: locals.disabled,
    ref: locals.ref
  };

  // textbox handle textarea too
  var control = (type === 'textbox') ?
    React.createElement('textarea', attrs) :
    React.createElement('input', attrs);

  return (
    <div>
      <label className={cx({'has-error': locals.hasError})}>{locals.label}</label>
      {control}
    </div>
  );
}

function checkboxTemplate(locals) {
  throw new Error('unimplemented (yet)');
}

function getOption(option, i) {
  return style.Option.is(option) ?
    <option value={option.value} key={option.value}>{option.text}</option> :
    <optgroup label={option.group} key={option.group}>
      {option.options.map(getOption)}
    </optgroup>
}

function selectTemplate(locals) {

  var control = (
    <select name={locals.name}
      defaultValue={locals.value}
      disabled={locals.disabled}
      multiple={locals.multiple}
      ref={locals.ref}>
      {locals.options.map(getOption)}
    </select>
  );

  return (
    <div>
      <label className={cx({'has-error': locals.hasError})}>{locals.label}</label>
      {control}
    </div>
  );
}

function radioTemplate(locals) {
  throw new Error('unimplemented (yet)');
}

function structTemplate(locals) {
  throw new Error('In grid forms you must write a custom template for structs');
}

function listTemplate(locals) {
  throw new Error('unimplemented (yet)');
}
