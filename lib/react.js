'use strict';

//=======================
// dsl -> render (React)
//=======================

var React = require('react');
var t = require('tcomb-validation');
var dsl = require('./dsl');
var style = require('./style');
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

dsl.Textbox.prototype.render = function () {

  var Textbox = React.createClass({

    mixins: [LeafMixin(this)],

    getRawValue: function () {
      return this.refs.input.getDOMNode().value.trim() || null;
    },

    render: function () {
      var state = this.state;
      var error = null; // FIXME
      var textbox = new style.Textbox({
        ref: 'input',
        type: state.typeAttr,
        name: state.name,
        value: state.value,
        placeholder: state.placeholder,
        label: state.label,
        help: state.help,
        error: null
      });
      return compile(textbox.render());
    }

  });

  return Textbox;
};

dsl.Checkbox.prototype.render = function () {

  var Checkbox = React.createClass({

    mixins: [LeafMixin(this)],

    getRawValue: function () {
      return this.refs.input.getDOMNode().checked;
    },

    render: function () {
      var state = this.state;
      var error = null; // FIXME
      var checkbox = new style.Checkbox({
        ref: 'input',
        name: state.name,
        value: state.value,
        label: state.label,
        help: state.help,
        error: error
      });
      return compile(checkbox.render());
    }

  });

  return Checkbox;
};

dsl.Select.prototype.render = function () {

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
      var state = this.state;
      var error = null; // FIXME
      var select = new style.Select({
        ref: 'input',
        name: state.name,
        value: state.value,
        label: state.label,
        help: state.help,
        error: error,
        options: state.options,
        disabled: state.disabled
      });
      return compile(select.render());
    }

  });

  return Select;
};

dsl.Radio.prototype.render = function () {

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
      var state = this.state;
      var error = null; // FIXME
      var radio = new style.Radio({
        ref: 'input',
        name: state.name,
        value: state.value,
        label: state.label,
        help: state.help,
        error: error,
        options: state.options
      });
      return compile(radio.render());
    }

  });

  return Radio;
};

dsl.Struct.prototype.render = function () {

  var self = this;

  var rows = this.rows.map(function (row) {
    return {
      tag: row.render(style),
      ref: row.key
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
      var state = this.state;
      var error = null; // FIXME
      var fieldset = new style.Fieldset({
        label: state.label,
        rows: rows
      });
      return compile(fieldset.render());
    }
  });

  return Struct;
};

dsl.List.prototype.render = function () {

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

    add: function (evt) {
      evt.preventDefault();
      this.state = this.state.addRow();
      this.forceUpdate();
    },

    remove: function (i, evt) {
      evt.preventDefault();
      this.state = this.state.removeRow(i);
      this.forceUpdate();
    },

    up: function (i, evt) {
      evt.preventDefault();
      if (i > 0) {
        this.state = this.state.moveUpRow(i);
        this.forceUpdate();
      }
    },

    down: function (i, evt) {
      evt.preventDefault();
      if (i < this.state.rows.length - 1) {
        this.state = this.state.moveDownRow(i);
        this.forceUpdate();
      }
    },

    render: function () {

      var self = this;
      var state = this.state;

      var rows = state.rows.map(function (row, i) {

        var buttons = [];
        if (state.removeLabel) { buttons.push({ label: state.removeLabel, click: self.remove.bind(self, i) }); }
        if (state.upLabel) { buttons.push({ label: state.upLabel, click: self.up.bind(self, i) }); }
        if (state.downLabel) { buttons.push({ label: state.downLabel, click: self.down.bind(self, i) }); }

        return {
          item: React.createFactory(row.render(style))({ref: i}),
          buttons: buttons
        };
      });

      var add = state.addLabel ? {label: state.addLabel, click: this.add} : null;

      var error = null; // FIXME
      var list = new style.List({
        label: state.label,
        rows: rows,
        add: add
      });
      return compile(list.render());
    }
  });

  return List;
};
