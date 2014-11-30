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

      // change state based on validation result but `this.state`
      // is immmutable so I'll use the tcomb built-in update() function

      this.state = this.state.constructor.update(this.state, {
        hasError: {'$set': !result.isValid()},
        value: {'$set': result.value}
      });
      this.forceUpdate();

      return result;
    },

    render: function () {
      var uvdom = this.state.toUVDOM();
      var vdom = compile(uvdom);
      if (Array.isArray(vdom)) {
        vdom = React.createElement.apply(null, ['div', null].concat(vdom));
      }
      return vdom;
    }
  };
};

dsl.Textbox.prototype.render = function () {
  var self = this;
  return React.createClass({

    mixins: [Mixin(self)],

    getRawValue: function () {
      return this.refs[self._ref].getDOMNode().value.trim() || null;
    }
  });
};

dsl.Checkbox.prototype.render = function () {
  var self = this;
  return React.createClass({

    mixins: [Mixin(self)],

    getRawValue: function () {
      return this.refs[self._ref].getDOMNode().checked;
    }
  });
};

dsl.Select.prototype.render = function () {
  var self = this;
  return React.createClass({

    mixins: [Mixin(self)],

    getRawValue: function () {
      var value = this.refs[self._ref].getDOMNode().value;
      if (self.emptyOption && value === self.emptyOption.value) {
        value = null;
      }
      return value;
    }
  });
};

dsl.Radio.prototype.render = function () {
  var self = this;
  return React.createClass({

    mixins: [Mixin(self)],

    getRawValue: function () {
      var value = null, node;
      for (var i = 0, len = self.options.length ; i < len ; i++ ) {
        node = this.refs[self.name + i].getDOMNode();
        if (node.checked) {
          value = node.value;
          break;
        }
      }
      return value;
    }
  });
};

dsl.Struct.prototype.render = function () {

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

  return React.createClass({

    displayName: 'Struct',

    getValue: function () {

      var value = {};
      var errors = [];
      var result, ref;

      for (ref in this.refs) {
        if (this.refs.hasOwnProperty(ref)) {
          result = this.refs[ref].getValue();
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

dsl.ListRow.prototype.render = function () {

  var self = this;

  return React.createClass({

    displayName: 'ListRow',

    render: function () {
      return compile(self.toUVDOM());
    }
  });
};

dsl.List.prototype.render = function () {

  // children are built only once
  var children = this.rows.map(function (row, i) {
    return {
      tag: row.render(),
      ref: row._ref
    };
  });

  var self = this;

  return React.createClass({

    displayName: 'List',

    getValue: function () {

      var value = [];
      var errors = [];
      var result, ref;

      for (var i = 0, len = self.rows.length ; i < len ; i++ ) {
        ref = self._ref + i;
        result = this.refs[ref].getValue();
        errors = errors.concat(result.errors);
        value.push(result.value);
      }

      return new ValidationResult({errors: errors, value: value});
    },

    render: function () {
      return compile(self.toUVDOM(children));
    }
  });
};
