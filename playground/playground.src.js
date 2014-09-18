$(function () {

  var React = require('react');
  var t = require('../index');
  
  var Any = t.Any;
  var Nil = t.Nil;
  var Str = t.Str;
  var Bool = t.Bool;
  var Num = t.Num;
  var Obj = t.Obj;
  var Func = t.Func;
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

  var scripts = {
    person: {
      label: 'Basic example: required fields'
    },
    maybe: {
      label: 'How to define optional fields'
    },
    signin: {
      label: 'Sign in form example: how to define subtypes'
    },
    customize: {
      label: 'Fields customization'
    },
    enumsSelect: {
      label: 'Enums: render as select'
    },
    enumsRadio: {
      label: 'Enums: render as radio'
    },
    customizeSelect: {
      label: 'How to customize a select'
    },
    number: {
      label: 'How to handle numbers'
    },
    textarea: {
      label: 'Textarea'
    },
    value: {
      label: 'How to set default values'
    }
  };

  var examples = {};
  var defaultExample = 'person';
  var select = '<select id="example" class="form-control">';
  Object.keys(scripts).forEach(function (id) {
    examples[id] = $('#' + id).text();
    select += '<option ';
    if (id === defaultExample) {
      select += ' selected="true" ';
    }
    select += 'value=' + id + '>' + scripts[id].label + '</option>';
  });
  select += '</select>'
  $('#examples').html(select);

  //
  // eval code
  //

  var $preview = $('#preview');
  var mountNode = $preview.get(0);
  var $json = $('#json');
  var $example = $('#example');
  var JSX_PREAMBLE = '/** @jsx React.DOM */\n';
  var POSTFIX = $('#postfix').html();
  function evalCode(code) {
    try {
      var js = JSXTransformer.transform(JSX_PREAMBLE + code + POSTFIX).code;
      return eval(js);
    } catch (e) {
      return e;
    }
  }

  function run() {
    $json.html('');
    var code = cm.getValue();
    var component;
    var json;
    try {
      component = evalCode(code);
    } catch (e) {
      component = e;
    }
    if (component instanceof Error) {
      $json.html('<div class="alert alert-danger">' + component.message + '</div>');
      $preview.html('');
    } else {
      $preview.hide();
      React.renderComponent(component(), mountNode);
      $preview.fadeIn();
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

  $example.on('change', function () {
    var id = $(this).val();
    cm.setValue(examples[id]);
    run();
  });
  run();

});