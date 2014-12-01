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

var Mixin = function (instance) {
  return {

    displayName: t.util.getName(instance.constructor),

    getInitialState: function () {
      return instance;
    },

    getValue: function () {
      var result = t.validate(this.getRawValue(), this.state.outerType);

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
      return this.refs[self.ref].getDOMNode().value.trim() || null;
    }
  });
};

dsl.Checkbox.prototype.render = function () {
  var self = this;
  return React.createClass({

    mixins: [Mixin(self)],

    getRawValue: function () {
      return this.refs[self.ref].getDOMNode().checked;
    }
  });
};

dsl.Select.prototype.render = function () {
  var self = this;
  return React.createClass({

    mixins: [Mixin(self)],

    getRawValue: function () {
      var value = this.refs[self.ref].getDOMNode().value;
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
  var children = this.rows.map(function (row, i) {
    if (dsl.Verbatim.is(row)) {
      return row.render();
    }
    return {
      tag: row.render(),
      ref: row.ref
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

dsl.List.prototype.render = function () {

  // children are built only once
  var children = this.rows.map(function (row, i) {
    return {
      tag: row.render(),
      ref: row.item.ref
    };
  });

  var self = this;

  return React.createClass({

    displayName: 'List',

    getInitialState: function () {
      return self;
    },

    getValue: function () {

      var value = [];
      var errors = [];
      var result;

      for (var i = 0, len = this.state.value.length ; i < len ; i++ ) {
        result = this.refs[i].refs[i].getValue();
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

dsl.ListRow.prototype.render = function () {

  var self = this;
  var item = {
    tag: this.item.render(),
    ref: this.item.ref
  };

  return React.createClass({

    displayName: 'ListRow',

    render: function () {
      return compile(self.toUVDOM(item));
    }
  });
};
