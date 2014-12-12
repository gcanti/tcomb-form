'use strict';

var React = require('react');
var t = require('tcomb-validation');
var cx = require('react/lib/cx');
var util = require('./util.jsx');
var theme = require('../protocols/theme');
var Label = theme.Label;

var Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

var Cols = t.subtype(t.tuple([Positive, Positive]), function (cols) {
  return cols[0] + cols[1] === 12;
}, 'Cols');

var Breakpoints = t.struct({
  xs: t.maybe(Cols),
  sm: t.maybe(Cols),
  md: t.maybe(Cols),
  lg: t.maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getClassName = function (f) {
  var className = {};
  for (var size in this) {
    if (this.hasOwnProperty(size) && !t.Nil.is(this[size])) {
      f(className, size, this[size]);
    }
  }
  return className;
};

Breakpoints.prototype.getLabelClassName = function () {
  var className = this.getClassName(function (className, size, col) {
    className['col-' + size + '-' + col[0]] = true;
  });
  className['text-right'] = true;
  return className
};

Breakpoints.prototype.getInputClassName = function () {
  return this.getClassName(function (className, size, col) {
    className['col-' + size + '-' + col[1]] = true;
  });
};

Breakpoints.prototype.getOffsetClassName = function () {
  return this.getClassName(function (className, size, col) {
    className['col-' + size + '-offset-' + col[0]] = true;
    className['col-' + size + '-' + col[1]] = true;
  });
};

var TextboxConfig = t.struct({
  addonBefore: t.maybe(Label),
  addonAfter: t.maybe(Label),
  horizontal: t.maybe(Breakpoints)
}, 'TextboxConfig');

var CheckboxConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'CheckboxConfig');

var SelectConfig = t.struct({
  addonBefore: t.maybe(Label),
  addonAfter: t.maybe(Label),
  horizontal: t.maybe(Breakpoints)
}, 'SelectConfig');

var RadioConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'RadioConfig');

function textbox(locals) {

  if (locals.type === 'hidden') {
    return util.getHiddenTextbox(locals);
  }

  var textbox = util.getTextbox(locals, 'form-control');
  var config = new TextboxConfig(locals.config || {});

  // handle addonBefore / addonAfter
  if (config.addonBefore || config.addonAfter) {
    textbox = (
      <div className="input-group">
        {getAddon(config.addonBefore)}
        {textbox}
        {getAddon(config.addonAfter)}
      </div>
    );
  }

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);
  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (horizontal) {
    return (
      <div className={cx(groupClassName)}>
        {label}
        <div className={cx(label ? horizontal.getInputClassName() : horizontal.getOffsetClassName())}>
          {textbox}
          {error}
          {help}
        </div>
      </div>
    );
  }

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

  var config = new CheckboxConfig(locals.config || {});
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);

  var checkbox = (
    <label>
      {util.getCheckbox(locals)} <span>{locals.label}</span>
    </label>
  );

  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  var horizontal = config.horizontal;
  if (horizontal) {
    return (
      <div className={cx(groupClassName)}>
        <div className={cx(horizontal.getOffsetClassName())}>
          <div className="checkbox">
            {checkbox}
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
        {checkbox}
        {error}
        {help}
      </div>
    </div>
  );
}

function select(locals) {

  var config = new SelectConfig(locals.config || {});

  var select = util.getSelect(locals, 'form-control');

  // handle addonBefore / addonAfter
  if (config.addonBefore || config.addonAfter) {
    select = (
      <div className="input-group">
        {getAddon(config.addonBefore)}
        {select}
        {getAddon(config.addonAfter)}
      </div>
    );
  }

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);
  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (horizontal) {
    return (
      <div className={cx(groupClassName)}>
        {label}
        <div className={cx(label ? horizontal.getInputClassName() : horizontal.getOffsetClassName())}>
          {select}
          {error}
          {help}
        </div>
      </div>
    );
  }

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

  var config = new RadioConfig(locals.config || {});

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

  var horizontal = config.horizontal;
  var label = getLabel(locals, horizontal);
  var error = getErrorBlock(locals);
  var help = getHelpBlock(locals);
  var groupClassName = {
    'form-group': true,
    'has-error': locals.hasError
  };

  if (horizontal) {
    return (
      <div className={cx(groupClassName)}>
        {label}
        <div className={cx(label ? horizontal.getInputClassName() : horizontal.getOffsetClassName())}>
          {radios}
          {error}
          {help}
        </div>
      </div>
    );
  }

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

  var items = locals.items.map(function (item) {
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
        <div className="col-md-6">
          {item.input}
        </div>
        <div className="col-md-6">
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

//
// helpers
//

function getLabel(locals, breakpoints) {
  if (!locals.label) { return; }
  var className = breakpoints ? breakpoints.getLabelClassName() : {};
  className['control-label'] = true;
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
  if (!locals.error || !locals.hasError) { return; }
  return (
    <span className="help-block error-block">
      {locals.error}
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

module.exports = {
  textbox: textbox,
  checkbox: checkbox,
  select: select,
  radio: radio,
  struct: struct,
  list: list
};