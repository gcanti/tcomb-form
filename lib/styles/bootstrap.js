'use strict';

var React = require('react');
var style = require('../protocols/style');
var cx = require('react/lib/cx');

module.exports = {
  textbox: textboxStyle,
  checkbox: checkboxStyle,
  select: selectStyle,
  radio: radioStyle,
  struct: structStyle,
  list: listStyle
};

function textboxStyle(locals) {

  locals = new style.Textbox(locals);

  var type = locals.type;
  if (type === 'hidden') {
    // if the textbox is hidden, no decorations only `name`, `value`.
    // And `ref` if you need to read the value
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
    className: 'form-control',
    defaultValue: locals.value,
    readOnly: locals.readOnly,
    disabled: locals.disabled,
    ref: locals.ref
  };

  // textbox handle textarea too
  var control = (type === 'textbox') ?
    React.createElement('textarea', attrs) :
    React.createElement('input', attrs);

  // handle addonBefore / addonAfter
  if (locals.addonBefore || locals.addonAfter) {
    control = (
      <div className="input-group">
        {getAddon(locals.addonBefore)}
        {control}
        {getAddon(locals.addonAfter)}
      </div>
    );
  }

  var label = getLabel(locals.label, locals.horizontal);
  var error = getErrorBlock(locals.message, locals.hasError);
  var help = getHelpBlock(locals.help);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (locals.horizontal) {

    var className = {
      'col-md-9': true,
      'col-md-offset-3': !locals.label
    };

    return (
      <div className={cx(groupClassName)}>
        {label}
        <div className={cx(className)}>
          {control}
          {error}
          {help}
        </div>
      </div>
    );
  }

  return (
    <div className={cx(groupClassName)}>
      {label}
      {control}
      {error}
      {help}
    </div>
  );
}

function checkboxStyle(locals) {

  locals = new style.Checkbox(locals);

  var control = (
    <label>
      <input type="checkbox" ref={locals.ref}/> <span>{locals.label}</span>
    </label>
  );

  var error = getErrorBlock(locals.message, locals.hasError);
  var help = getHelpBlock(locals.help);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (locals.horizontal) {
    return (
      <div className={cx(groupClassName)}>
        <div className="col-md-9 col-md-offset-3">
          <div className="checkbox">
            {control}
            {error}
            {help}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx(groupClassName)}>
      <div className="checkbox">
        {control}
        {error}
        {help}
      </div>
    </div>
  );
}

function getOption(option, i) {
  return style.Option.is(option) ?
    <option value={option.value} key={option.value}>{option.text}</option> :
    <optgroup label={option.group} key={option.group}>
      {option.options.map(getOption)}
    </optgroup>
}

function selectStyle(locals) {

  locals = new style.Select(locals);

  var options = locals.options.map(getOption);

  var control = (
    <select name={locals.name}
      className="form-control"
      defaultValue={locals.value}
      disabled={locals.disabled}
      multiple={locals.multiple}
      ref={locals.ref}>
      {options}
    </select>
  );

  var label = getLabel(locals.label, locals.horizontal);
  var error = getErrorBlock(locals.message, locals.hasError);
  var help = getHelpBlock(locals.help);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (locals.horizontal) {

    var className = {
      'col-md-9': true,
      'col-md-offset-3': !locals.label
    };

    return (
      <div className={cx(groupClassName)}>
        {label}
        <div className={cx(className)}>
          {control}
          {error}
          {help}
        </div>
      </div>
    );
  }

  return (
    <div className={cx(groupClassName)}>
      {label}
      {control}
      {error}
      {help}
    </div>
  );
}

function radioStyle(locals) {

  locals = new style.Radio(locals);

  var controls = locals.options.map(function (option, i) {
    return (
      <div className="radio" key={option.value}>
        <label>
          <input type="radio"
            name={locals.name}
            value={option.value}
            defaultChecked={option.value === locals.value}
            ref={locals.ref + i}/>
          {option.text}
        </label>
      </div>
    );
  });

  var label = getLabel(locals.label, locals.horizontal);
  var error = getErrorBlock(locals.message, locals.hasError);
  var help = getHelpBlock(locals.help);

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (locals.horizontal) {

    var className = {
      'col-md-9': true,
      'col-md-offset-3': !locals.label
    };

    return (
      <div className={cx(groupClassName)}>
        {label}
        <div className={cx(className)}>
          {controls}
          {error}
          {help}
        </div>
      </div>
    );
  }

  return (
    <div className={cx(groupClassName)}>
      {label}
      {controls}
      {error}
      {help}
    </div>
  );
}

function structStyle(locals) {

  locals = new style.Struct(locals);

  var legend = null;
  if (locals.label) {
    legend = <legend>{locals.label}</legend>;
  }

  var className = {
    'has-error': locals.hasError,
    'form-horizontal': locals.horizontal
  };

  return (
    <fieldset className={cx(className)}>
      {legend}
      {locals.rows}
      {getErrorBlock(locals.message, locals.hasError)}
      {getHelpBlock(locals.help)}
    </fieldset>
  );
}

function listStyle(locals) {

  locals = new style.List(locals);

  var rows = locals.rows.map(function (row, i) {
    if (!row.buttons.length) {
      return (
        <div className="row" key={row.key}>
          <div className="col-md-12">
            {row.component}
          </div>
        </div>
      );
    }
    return (
      <div className="row" key={row.key}>
        <div className="col-md-7">
          {row.component}
        </div>
        <div className="col-md-5">
          <div className="btn-group">
            {
              row.buttons.map(function (button, i) {
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
      {rows}
      {addButton}
      {getErrorBlock(locals.message, locals.hasError)}
      {getHelpBlock(locals.help)}
    </fieldset>
  );

}

function getLabel(label, horizontal) {
  if (!label) { return; }
  var className = {
    'control-label': true,
    'text-right': horizontal,
    'col-md-3': horizontal
  };
  return (
    <label className={cx(className)}>
      {label}
    </label>
  );
}

function getHelpBlock(label) {
  if (!label) { return; }
  return (
    <span className="help-block">
      {label}
    </span>
  );
}

function getErrorBlock(message, hasError) {
  if (!message || !hasError) { return; }
  return (
    <span className="help-block error-block">
      {message}
    </span>
  );
}

function getAddon(addon) {
  if (!addon) { return; }
  return (
    <span className="input-group-addon">
      {addon}
    </span>
  );
}




