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

  var form = t.form.form;
  var radio = t.form.radio;

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
    {id: 'labels', label: '2. Auto generated labels'},
    {id: 'optionalFields', label: '3. Optional fields'},
    {id: 'subtypes', label: '4. Subtypes'},
    {id: 'customize', label: '5. Booleans and fields customization'},
    {id: 'enumsSelect', label: '6. Enums: render as select (default)'},
    {id: 'enumsRadio', label: '7. Enums: render as radio'},
    {id: 'textarea', label: '8. Textarea'},
    {id: 'i17n', label: '9. i17n'},
    {id: 'defaultValues', label: '10. Default values'},
    {id: 'global', label: '11. How to set constraints on the whole form'},
  ];

  var examples = {};
  var defaultExample = 'showcase';
  scripts.forEach(function (script) {
    examples[script.id] = '// * ' + script.label + ' *\n\n' + $('#' + script.id).text();
  });

  var examplesHtml = '<ul id="examplesGroup" class="list-group">';
  examplesHtml += scripts.map(function (script) {
    return '<li class="list-group-item' + (script.id === defaultExample ? ' selected' : '') + '" data="' + script.id + '">' + script.label + '</li>';
  }).join('');
  examplesHtml += '</ul>';
  $('#examples').html(examplesHtml);

  var $preview =    $('#preview');
  var $html =       $('#html');
  var $formValues = $('#formValues');
  var $examples =   $('#examples .list-group-item');
  var POSTFIX =     $('#postfix').html();

  function evalCode(code) {
    try {
      var js = code + POSTFIX;
      return eval(js);
    } catch (e) {
      return e;
    }
  }

  function escapeHtml(html) {
    return html
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
  }

  function renderComponent(component) {
    React.renderComponent(component(), $preview.get(0));
    $formValues.hide();
    var html = $('#preview div div').html();
    html = html.replace(/data-reactid="(.[^"]*)"/gm, '');
    $html.html(escapeHtml(beautifyHtml(html)));
    hljs.highlightBlock($html.get(0));
  }

  function renderFormValues(value) {
    var html = '<p class="lead">Form values</p>';
    html += 'This is an instance of the type. Open up the console to see the details.<br/><br/>';
    html += '<div class="alert alert-success"><pre>' + JSON.stringify(value, null, 2) + '</pre></div>';
    $formValues.show().html(html);
  }

  function renderError(err) {
    var html = '<p class="lead">Error!</p>';
    html += '<div class="alert alert-danger">' + err.message + '</div>';
    $formValues.show().html(html);
  }

  function run() {
    var code = cm.getValue();
    try {
      var component = evalCode(code);
      renderComponent(component);
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

  $examples.click(function () {
    $examples.removeClass('selected');
    var id = $(this).addClass('selected').attr('data');
    cm.setValue(examples[id]);
    run();
  });

  run();

});