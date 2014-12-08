'use strict';

var React = require('react');
var style = require('../protocols/style');
var cx = require('react/lib/cx');

module.exports = {
  name: 'bootstrap',
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

  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

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

function checkboxTemplate(locals) {

  var control = (
    <label>
      <input type="checkbox" ref={locals.ref}/> <span>{locals.label}</span>
    </label>
  );

  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

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

function selectTemplate(locals) {

  var control = (
    <select name={locals.name}
      className="form-control"
      defaultValue={locals.value}
      disabled={locals.disabled}
      multiple={locals.multiple}
      ref={locals.ref}>
      {locals.options.map(getOption)}
    </select>
  );

  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

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

function radioTemplate(locals) {

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

  var label = getLabel(locals);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

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

function structTemplate(locals) {

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
    'has-error': locals.hasError,
    'form-horizontal': locals.horizontal
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

function listTemplate(locals) {

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
      {getErrorBlock(locals)}
      {getHelpBlock(locals)}
    </fieldset>
  );

}

function getLabel(locals) {
  if (!locals.label) { return; }
  var className = {
    'control-label': true,
    'text-right':locals.horizontal,
    'col-md-3': locals.horizontal
  };
  return (
    <label className={cx(className)}>
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

function getAddon(addon) {
  if (!addon) { return; }
  return (
    <span className="input-group-addon">
      {addon}
    </span>
  );
}




