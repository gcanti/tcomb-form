var React = require('react');
var t = require('../../.');
var Str = t.Str;
var Num = t.Num;
var types = require('../types');

// model
var Data = t.struct({
  productName: Str,
  tags: t.list(Str),
  vendor: types.Vendor,
  productType: types.ProductType,
  productDescription: t.maybe(Str),
  sku: Str,
  initialStockLevel: Num,
  costPrice: Num,
  wholesalePrice: Num,
  retailPrice: Num
});

// React form component
var Form = t.form.create(Data, {
  label: 'Add to inventory',
  auto: 'labels', // automatically create labels from field names
  value: {
    productName: 'aaa',
    tags: null,
    vendor: 'bbb',
    productType: 'ccc',
    productDescription: null,
    sku: 'ddd',
    initialStockLevel: 1000,
    costPrice: 700,
    wholesalePrice: null,
    retailPrice: 1000
  },
  fields: {
    tags: {
      auto: 'placeholders'
    }
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
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Save" />
        </div>
      </form>
    );
  }
});

React.render(<App />, document.getElementById('app'));
