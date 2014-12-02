'use strict';

//====================
// dsl -> React class
//====================

var React = require('react');
var t = require('tcomb-validation');
var dsl = require('./dsl');
var compile = require('uvdom/react').compile;

var ValidationResult = t.ValidationResult;

var LeafMixin = function (instance) {
  return {

    getInitialState: function () {
      return instance;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), this.state.type);

      // change state based on validation result but `this.state`
      // is immmutable so I'll use the tcomb built-in update() function

      this.state = this.state.constructor.update(this.state, {
        hasError: {'$set': !result.isValid()},
        value: {'$set': result.value}
      });
      this.forceUpdate();

      return result;
    }

  };
};

dsl.Textbox.prototype.render = function (style) {

  var Textbox = React.createClass({

    mixins: [LeafMixin(this)],

    getRawValue: function () {
      return this.refs.input.getDOMNode().value.trim() || null;
    },

    render: function () {
      return compile(style.textbox(this.state));
    }

  });

  return Textbox;
};

dsl.Checkbox.prototype.render = function (style) {

  var Checkbox = React.createClass({

    mixins: [LeafMixin(this)],

    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    },

    render: function () {
      return compile(style.checkbox(this.state));
    }

  });

  return Checkbox;
};

dsl.Select.prototype.render = function (style) {

  var Select = React.createClass({

    mixins: [LeafMixin(this)],

    getRawValue: function () {
      var value = this.refs.input.getDOMNode().value;
      var emptyOption = this.state.emptyOption;
      if (emptyOption && (value === emptyOption.value)) {
        return null;
      }
      return value;
    },

    render: function () {
      return compile(style.select(this.state));
    }

  });

  return Select;
};

dsl.Radio.prototype.render = function (style) {

  var Radio = React.createClass({

    mixins: [LeafMixin(this)],

    getRawValue: function () {
      var value = null, node;
      for (var i = 0, len = this.state.options.length ; i < len ; i++ ) {
        node = this.refs['input' + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }
      return value;
    },

    render: function () {
      return compile(style.radio(this.state));
    }

  });

  return Radio;
};

dsl.Struct.prototype.render = function (style) {

  var self = this;

  var rows = this.rows.map(function (row) {
    return {
      tag: row.render(style),
      ref: row.key,
      key: row.key
    };
  });

  var Struct = React.createClass({

    getInitialState: function () {
      return self;
    },

    getValue: function () {

      var value = {};
      var errors = [];
      var result;

      for (var ref in this.refs) {
        if (this.refs.hasOwnProperty(ref)) {
          result = this.refs[ref].getValue();
          errors = errors.concat(result.errors);
          value[ref] = result.value;
        }
      }

      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {
      return compile(style.fieldset(this.state.label, rows));
    }
  });

  return Struct;
};

dsl.List.prototype.render = function (style) {

  var self = this;

  var List = React.createClass({

    getInitialState: function () {
      return self;
    },

    getValue: function () {

      var value = [];
      var errors = [];
      var result;

      for (var i = 0, len = this.state.rows.length ; i < len ; i++ ) {
        result = this.refs[i].getValue();
        errors = errors.concat(result.errors);
        value.push(result.value);
      }

      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {

      var rows = this.state.rows.map(function (row) {
        return {
          tag: row.render(style),
          ref: row.key,
          key: row.key
        };
      });

      return compile(style.fieldset(this.state.label, rows));
    }
  });

  return List;
};
