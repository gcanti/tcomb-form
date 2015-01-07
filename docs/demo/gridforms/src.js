'use strict';

var React = require('react');
var t = require('../../../.');

// configure ionic plugin
t.form.config.templates = require('../../../lib/themes/gridforms');

// helper function
function render(i, type, opts) {

  var formPreview = document.getElementById('p' + i);
  var Form = t.form.create(type, opts);

  var App  = React.createClass({

    onClick: function () {
      var value = this.refs.form.getValue();
      if (value) {
        var valuePreview = document.getElementById('v' + i)
        valuePreview.style.display = 'block';
        valuePreview.innerHTML = JSON.stringify(value, null, 2);
      }
    },

    render: function () {
      return (
        React.DOM.div({className: "grid-form"},
          React.createFactory(Form)({ref: 'form'}),
          React.DOM.br(),
          React.DOM.button({
            onClick: this.onClick,
            className: 'btn btn-primary'
          }, 'Click me')
        )
      );
    }

  });

  React.render(React.createFactory(App)(), formPreview);
}

var Vendor = t.enums.of(['Magna Phasellus Dolor Incorporated', 'Fames Ac Turpis Inc.']);

var ProductType = t.enums.of(['Vivamus rhoncus.', 'egestas ligula.']);

var Product = t.struct({
  productName: t.Str,
  tags: t.Str,
  vendor: Vendor,
  productType: ProductType,
  productDescription: t.maybe(t.Str),
  sku: t.Str,
  initialStockLevel: t.Num,
  costPrice: t.Num,
  wholesalePrice: t.Num,
  retailPrice: t.Num
});

render('1', Product, {
  auto: 'labels',
  label: 'Add to inventory',
  templates: {
    struct: mylayout  // custom template for structs
  },
  fields: {
    initialStockLevel: {
      help: 'Insert a number'
    }
  }
});

// custom template for structs
function mylayout(locals) {

  // hash field name -> field input
  var inputs = locals.inputs;

  return (
    React.createElement("fieldset", null,
      React.createElement("legend", null, locals.label),
      React.createElement("div", {'data-row-span': "4"},
        React.createElement("div", {'data-field-span': "3"},
          inputs.productName
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.tags
        )
      ),
      React.createElement("div", {'data-row-span': "2"},
        React.createElement("div", {'data-field-span': "1"},
          inputs.vendor
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.productType
        )
      ),
      React.createElement("div", {'data-row-span': "1"},
        React.createElement("div", {'data-field-span': "1"},
          inputs.productDescription
        )
      ),
      React.createElement("div", {'data-row-span': "5"},
        React.createElement("div", {'data-field-span': "1"},
          inputs.sku
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.initialStockLevel
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.costPrice
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.wholesalePrice
        ),
        React.createElement("div", {'data-field-span': "1"},
          inputs.retailPrice
        )
      )
    )
  );
}
