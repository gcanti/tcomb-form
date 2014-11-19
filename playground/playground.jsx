$(function () {

  var React = require('react');
  var t = require('../index');
  var beautifyHtml = require('js-beautify').html;

  var Any = t.Any;
  var Nil = t.Nil;
  var Str = t.Str;
  var Bool = t.Bool;
  var Num = t.Num;
  var Obj = t.Obj;
  var Func = t.Func;
  var Arr = t.Arr;
  var irriducible = t.irriducible;
  var maybe = t.maybe;
  var enums = t.enums;
  var list = t.list;
  var subtype = t.subtype;
  var struct = t.struct;

  var createForm = t.form.createForm;
  var createList = t.form.createList;
  var radio = t.form.radio;
  var select = t.form.select;

  //
  // setup
  //

  // override default fail behaviour of tcomb https://github.com/gcanti/tcomb
  t.options.onFail = function (message) {
    throw new Error(message);
  };

  //
  // load examples
  //

  var scripts = [
    {id: 'showcase', label: 'Showcase'},
    {id: 'requiredFields', label: '1. Required fields'},
    {id: 'optionalFields', label: '2. Optional fields'},
    {id: 'labels', label: '3. Auto generated labels'},
    {id: 'subtypes', label: '4. Subtypes'},
    {id: 'customize', label: '5. Booleans and fields customization'},
    {id: 'enumsSelect', label: '6. Enums: render as select (default)'},
    {id: 'enumsRadio', label: '7. Enums: render as radio'},
    {id: 'i17n', label: '8. i17n'},
    {id: 'defaultValues', label: '9. Default values'},
    {id: 'global', label: '10. How to set constraints on the whole form'},
    {id: 'lists', label: '11. Lists'},
    {id: 'listOfStructs', label: '12. Lists of structs'},
    {id: 'nestedLists', label: '13. Nested lists'},
    {id: 'goodies', label: '14. Bootstrap goodies'},
    {id: 'horizontal', label: '15. Horizontal forms'},
    {id: 'customInput', label: '16. Custom input'},
    {id: 'multiple', label: '17. Multiple select'},
    {id: 'hasError', label: '18. Setting an error message'}
  ];

  var examples = {};
  var defaultExample = 'showcase';
  scripts.forEach(function (script) {
    examples[script.id] = '// * ' + script.label + ' *\n\n' + $('#' + script.id).text();
  });

  var examplesHtml = '<select id="examplesGroup" class="form-control">';
  examplesHtml += scripts.map(function (script) {
    return '<option' + (script.id === defaultExample ? ' selected="true"' : '') + ' value="' + script.id + '">' + script.label + '</option>';
  }).join('');
  examplesHtml += '</select>';
  $('#examples').html(examplesHtml);

  var $preview =    $('#preview');
  var $html =       $('#html');
  var $formValues = $('#formValues');
  var $examples =   $('#examples select');
  var POSTFIX =     $('#postfix').html();

  function escapeHtml(html) {
    return html
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
  }

  var component;

  function renderHtml() {
    var html = React.renderToString(component);
    html = html.replace(/data-reactid="(.[^"]*)"/gm, '');
    //html = html.replace(/data-react-checksum="(.[^"]*)"/gm, '');
    $html.html(escapeHtml(beautifyHtml(html)));
    hljs.highlightBlock($html.get(0));
  }

  function renderFactory(factory) {
    component = factory();
    React.render(component, $preview.get(0));
    $formValues.hide();
    renderHtml();
  }

  function renderFormValues(value) {
    var html = '<h3>Form values</h3>';
    html += 'This is an instance of the type. Open up the console to see the details.<br/><br/>';
    html += '<div class="alert alert-success"><pre>' + JSON.stringify(value, null, 2) + '</pre></div>';
    $formValues.show().html(html);
  }

  function renderError(err) {
    var html = '<h3>Error!</h3>';
    html += '<div class="alert alert-danger">' + err.message + '</div>';
    $formValues.show().html(html);
  }

  function run(id) {
    var code = cm.getValue();
    try {
      var className = id === 'horizontal' ? '"form-horizontal"' : 'null';
      var js = code + POSTFIX.replace(/:className/, className);
      var factory = eval(js);
      renderFactory(React.createFactory(factory));
    } catch (err) {
      renderError(err);
    }
  }

  var cm = CodeMirror.fromTextArea($('#code').get(0), {
    mode: 'javascript',
    lineNumbers: false,
    lineWrapping: true,
    smartIndent: false  // javascript mode does bad things with jsx indents
  });
  cm.setValue(examples[defaultExample]);
  cm.on("change", run);

  $examples.on('change', function () {
    var id = $(this).val();
    cm.setValue(examples[id]);
    run(id);
  });

  run(defaultExample);

});