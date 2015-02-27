/// <reference path="react.d.ts" />
/// <reference path="tcomb-form.d.ts" />

// tsc tcomb-form-tests.ts --module commonjs --noImplicitAny

import React = require('react');
import t = require('tcomb-form');
import bootstrap = require('tcomb-form/lib/skins/bootstrap');

// pluggable skins
t.form.config.templates = bootstrap;

// API
var form: Object = t.form;
var config: t.form.Config = t.form.config;
var templates: tcomb.form.Skin = t.form.config.templates;
var i18n: t.form.I18n = t.form.config.i18n;
var Select: t.form.Component = t.form.Select;
var Radio: t.form.Component = t.form.Radio;
var Form: t.form.Form = t.form.Form;

// instance
var factory: React.ComponentFactory<t.form.FormProps> = React.createFactory<t.form.FormProps>(Form);
factory({
  type: t.struct({
    name: t.Str
  }),
  options: {
    auto: 'labels'
  }
});

