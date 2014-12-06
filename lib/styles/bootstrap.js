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

  if (locals.addonBefore || locals.addonAfter) {
    control = (
      <div className="input-group">
        {getAddon(locals.addonBefore)}
        {control}
        {getAddon(locals.addonAfter)}
      </div>
    );
  }

  var className = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(className)}>
      {getLabel(locals.label)}
      {control}
      {getErrorBlock(locals.message, locals.hasError)}
      {getHelpBlock(locals.help)}
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

  var className = {
    checkbox: true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(className)}>
      {control}
      {getErrorBlock(locals.message, locals.hasError)}
      {getHelpBlock(locals.help)}
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

  var className = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(className)}>
      {getLabel(locals.label)}
      {control}
      {getErrorBlock(locals.message, locals.hasError)}
      {getHelpBlock(locals.help)}
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

  var className = {
    'form-group': true,
    'has-error': locals.hasError
  };

  return (
    <div className={cx(className)}>
      {getLabel(locals.label)}
      {controls}
      {getErrorBlock(locals.message, locals.hasError)}
      {getHelpBlock(locals.help)}
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
    'has-error': locals.hasError
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

function getLabel(label) {
  if (!label) { return; }
  return (
    <label className="control-label">
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




