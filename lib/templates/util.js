'use strict';

var React = require('react');
var theme = require('../protocols/theme');

module.exports = {
  getRadio: getRadio,
  getCheckbox: getCheckbox,
  getHiddenTextbox: getHiddenTextbox,
  getTextbox: getTextbox,
  getOption: getOption,
  getSelect: getSelect
};

function getRadio(locals) {
  return <input type="radio"
    name={locals.name}
    value={locals.value}
    defaultChecked={locals.defaultChecked}
    ref={locals.ref}/>;
}

function getCheckbox(locals) {
  return <input
    type="checkbox"
    name={locals.name}
    defaultChecked={locals.defaultValue}
    ref={locals.ref}/>;
}

function getHiddenTextbox(locals) {
  return <input
    type="hidden"
    name={locals.name}
    defaultValue={locals.value}
    ref={locals.ref}/>;
}

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

  return (type === 'textbox') ?
    React.createElement('textarea', attrs) :
    React.createElement('input', attrs);
}

function getOption(option, i) {
  return theme.Option.is(option) ?
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
