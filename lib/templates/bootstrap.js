'use strict';

var React = require('react');
var style = require('../protocols/style');
var cx = require('react/lib/cx');
var util = require('./util');

module.exports = {

  name: 'bootstrap',

  // templates
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list,

  // utils
  getErrorBlock: getErrorBlock,
  getHelpBlock: getHelpBlock,
  getLabel: getLabel
};

function textbox(locals) {

  if (locals.type === 'hidden') {
    return util.getHiddenTextbox(locals);
  }

  var textbox = util.getTextbox(locals, 'form-control');
  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(groupClassName)}>
      {label}
      {textbox}
      {error}
      {help}
    </div>
  );
}

function checkbox(locals) {

  var checkbox = (
    <label>
      {util.getCheckbox(locals)} <span>{locals.label}</span>
    </label>
  );
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(groupClassName)}>
      <div className="checkbox">
        {checkbox}
        {error}
        {help}
      </div>
    </div>
  );
}

function select(locals) {

  var select = util.getSelect(locals, 'form-control');
  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(groupClassName)}>
      {label}
      {select}
      {error}
      {help}
    </div>
  );
}

function radio(locals) {

  var radios = locals.options.map(function (option, i) {
    return (
      <div className="radio" key={option.value}>
        <label>
          {
            util.getRadio({
              name: locals.name,
              value: option.value,
              defaultChecked: (option.value === locals.value),
              ref: locals.ref + i
            })
          }
          {option.text}
        </label>
      </div>
    );
  });

  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(groupClassName)}>
      {label}
      {radios}
      {error}
      {help}
    </div>
  );
}

function struct(locals) {

  var rows = locals.order.map(function (name) {
    // handle verbatims
    return locals.inputs.hasOwnProperty(name) ?
      locals.inputs[name] :
      name;
  });

  var legend = null;
  if (locals.label) {
    legend = <legend>{locals.label}</legend>;
  }

  var className = {
    'has-error': locals.hasError
  };

  return (
    <fieldset className={cx(className)}>
      {legend}
      {rows}
      {getErrorBlock(locals)}
      {getHelpBlock(locals)}
    </fieldset>
  );
}

function list(locals) {

  var items = locals.items.map(function (item, i) {
    if (!item.buttons.length) {
      return (
        <div className="row" key={item.key}>
          <div className="col-md-12">
            {item.input}
          </div>
        </div>
      );
    }
    return (
      <div className="row" key={item.key}>
        <div className="col-md-8">
          {item.input}
        </div>
        <div className="col-md-4">
          <div className="btn-group">
            {
              item.buttons.map(function (button, i) {
                return (
                  <button className="btn btn-default" onClick={button.click} key={i}>{button.label}</button>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  });

  var legend = null;
  if (locals.label) {
    legend = <legend>{locals.label}</legend>;
  }

  var addButton = null;
  if (locals.add) {
    addButton = (
      <div className="form-group">
        <button className="btn btn-default" onClick={locals.add.click}>{locals.add.label}</button>
      </div>
    );
  }

  var className = {
    'has-error': locals.hasError
  };

  return (
    <fieldset className={cx(className)}>
      {legend}
      {items}
      {addButton}
      {getErrorBlock(locals)}
      {getHelpBlock(locals)}
    </fieldset>
  );

}

function getLabel(locals) {
  if (!locals.label) { return; }
  return (
    <label className="control-label">
      {locals.label}
    </label>
  );
}

function getHelpBlock(locals) {
  if (!locals.help) { return; }
  return (
    <span className="help-block">
      {locals.help}
    </span>
  );
}

function getErrorBlock(locals) {
  if (!locals.message || !locals.hasError) { return; }
  return (
    <span className="help-block error-block">
      {locals.message}
    </span>
  );
}
