var React = require('react');
var t = require('../../lib');

// configure gridforms plugin
t.form.config.templates = require('../../lib/templates/gridforms');

var Vendor = t.enums.of([
  'ted'
, 'Magna Phasellus Dolor Incorporated'
, 'Fames Ac Turpis Inc.'
, 'Eu Eros Institute'
, 'Suspendisse Sagittis Associates'
, 'Tempor Lorem PC'
, 'Nulla Facilisi Sed PC'
, 'Dignissim Corp.'
, 'Blandit Ltd'
, 'Dapibus Gravida Aliquam LLP'
, 'Cursus A Inc.'
, 'Tellus PC'
, 'Fusce Mi Foundation'
, 'Dictum Sapien Aenean Associates'
, 'In Tincidunt PC'
, 'Sapien Aenean Ltd'
, 'Libero Foundation'
, 'Egestas Rhoncus Proin Corp.'
, 'Feugiat Nec Diam Institute'
, 'Turpis Foundation'
, 'Pede Malesuada Vel Associates'
, 'Eget Venenatis A PC'
, 'Mollis Vitae Corporation'
, 'Gravida Mauris Incorporated'
, 'Tortor Consulting'
, 'Habitant Morbi Tristique Corporation'
, 'Enim Corp.'
, 'Sed Turpis Nec LLC'
, 'Enim Foundation'
, 'Tincidunt Orci Quis Institute'
, 'Lectus Pede LLC'
, 'Class Corporation'
, 'Erat Volutpat Nulla LLP'
, 'Sed LLC'
, 'Justo Faucibus Associates'
, 'Vel Turpis Foundation'
, 'Tellus Aenean Limited'
, 'Tempus Scelerisque Corporation'
, 'Eleifend LLP'
, 'A Felis Ullamcorper Company'
, 'Neque Non LLC'
, 'Nibh Donec Est PC'
]);

var ProductType = t.enums.of([
  'et magnis'
, 'Vivamus rhoncus.'
, 'egestas ligula.'
, 'nulla. Cras'
, 'Proin mi.'
, 'turpis non'
, 'ante ipsum'
, 'arcu. Curabitur'
, 'ante. Maecenas'
, 'magna. Phasellus'
, 'Suspendisse aliquet,'
, 'purus gravida'
, 'ac risus.'
, 'mollis non,'
]);

var Data = t.struct({
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

var Form = t.form.create(Data, {
  label: 'Add to inventory',
  auto: 'labels',           // automatically create labels from field names
  templates: {struct: structTemplate}, // custom template for structs
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
    initialStockLevel: {
      help: 'Insert a number'
    }
  }
});

var App = React.createClass({

  onClick: function(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      document.getElementById('value').innerHTML = JSON.stringify(value, null, 2);
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onClick} className="grid-form">
        <Form ref="form" />
        <input type="submit" value="Submit" />
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


