'use strict';

var React = require('react');
var style = require('../protocols/style');

module.exports = {
  getTextbox: getTextbox,
  getOption: getOption,
  getSelect: getSelect
};

function getTextbox(locals, className) {

  var type = locals.type;

  var attrs = {
    name: locals.name,
    type: (type === 'textarea') ? null : type,
    placeholder: locals.placeholder,
    className: className,
    defaultValue: locals.value,
    readOnly: locals.readOnly,
    disabled: locals.disabled,
    ref: locals.ref
  };

  // textbox handle textarea too
  return (type === 'textbox') ?
    React.createElement('textarea', attrs) :
    React.createElement('input', attrs);
}

function getOption(option, i) {
  return style.Option.is(option) ?
    <option value={option.value} key={option.value}>{option.text}</option> :
    <optgroup label={option.group} key={option.group}>
      {option.options.map(getOption)}
    </optgroup>
}

function getSelect(locals, className) {
  return (
    <select name={locals.name}
      className={className}
      defaultValue={locals.value}
      disabled={locals.disabled}
      multiple={locals.multiple}
      ref={locals.ref}>
      {locals.options.map(getOption)}
    </select>
  );
}
