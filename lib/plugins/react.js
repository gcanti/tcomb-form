'use strict';

//
// React rendering plugin
//

var React = require('react');
var t = require('tcomb-validation');
var dsl = require('../dsl');
var compile = require('uvdom/react').compile;

var ValidationResult = t.ValidationResult;

dsl.Verbatim.prototype.render = function () {
  return this.toUVDOM();
};

var Mixin = function (dsl) {
  return {

    displayName: t.util.getName(dsl.constructor),

    getInitialState: function () {
      return dsl;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), this.state._type);
      this.state.hasError = !result.isValid();
      this.state.value = result.value;
      this.forceUpdate();
      return result;
    },

    render: function () {
      var vdom = compile(this.state.toUVDOM());
      if (Array.isArray(vdom)) {
        vdom = React.createElement.apply(null, ['div', null].concat(vdom));
      }
      return vdom;
    }
  };
};

dsl.Textbox.prototype.render = function () {
  return React.createClass({
    mixins: [Mixin(this)],
    getRawValue: function () {
      return this.refs.input.getDOMNode().value.trim() || null;
    }
  });
};

dsl.Checkbox.prototype.render = function () {
  return React.createClass({
    mixins: [Mixin(this)],
    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    }
  });
};

dsl.Fieldset.prototype.render = function () {

  // children are built only once
  var children = this.fields.map(function (field, i) {
    if (dsl.Verbatim.is(field)) {
      return field.render();
    }
    return {
      tag: field.render(),
      ref: field._ref
    };
  });

  var self = this;
  var props = this._type.meta.props;

  return React.createClass({

    getValue: function () {
      var value = {};
      var errors = [];
      for (var ref in props) {
        if (props.hasOwnProperty(ref)) {
          var result = this.refs[ref].getValue();
          errors = errors.concat(result.errors);
          value[ref] = result.value;
        }
      }
      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {
      return compile(self.toUVDOM(children));
    }
  });
};

