var React = require('react');
var t = require('../../lib');
var Str = t.Str;
var Num = t.Num;

// gridforms plugin
t.form.config.templates = require('../../lib/templates/gridforms');

// model
var Data = t.struct({
  productName: Str,
  tags: Str,
  vendor: Str,
  productType: Str,
  productDescription: Str,
  sku: Str,
  initialStockLevel: Str,
  costPrice: Num,
  wholesalePrice: Num,
  retailPrice: Num
});

// React form component
var Form = t.form.create(Data, {
  auto: 'labels',           // automatically create labels from field names
  template: structTemplate, // custom template for structs
  value: {
    productName: 'a',
    tags: 'b',
    vendor: 'c',
    productType: 'd',
    productDescription: null,
    sku: 'f',
    initialStockLevel: 1000,
    costPrice: 700,
    wholesalePrice: null,
    retailPrice: 1000
  }
});

// rendering
var App = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var values = this.refs.form.getValue();
    if (values) {
      document.getElementById('value').innerHTML = JSON.stringify(values, null, 2);
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onClick} className="grid-form">
        <Form ref="form" />
        <input type="submit" value="Save" />
      </form>
    );
  }
});

React.render(<App />, document.getElementById('app'));

// custom template for structs
function structTemplate(locals) {

  // hash field -> input
  var inputs = locals.inputs;

  return (
    <fieldset>
      <legend>{locals.label}</legend>
      <div data-row-span="4">
        <div data-field-span="3">
          {inputs.productName}
        </div>
        <div data-field-span="1">
          {inputs.tags}
        </div>
      </div>
      <div data-row-span="2">
        <div data-field-span="1">
          {inputs.vendor}
        </div>
        <div data-field-span="1">
          {inputs.productType}
        </div>
      </div>
      <div data-row-span="1">
        <div data-field-span="1">
          {inputs.productDescription}
        </div>
      </div>
      <div data-row-span="5">
        <div data-field-span="1">
          {inputs.sku}
        </div>
        <div data-field-span="1">
          {inputs.initialStockLevel}
        </div>
        <div data-field-span="1">
          {inputs.costPrice}
        </div>
        <div data-field-span="1">
          {inputs.wholesalePrice}
        </div>
        <div data-field-span="1">
          {inputs.retailPrice}
        </div>
      </div>
    </fieldset>
  );
}


