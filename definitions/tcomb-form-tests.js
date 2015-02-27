/// <reference path="react.d.ts" />
/// <reference path="tcomb-form.d.ts" />
// tsc tcomb-form-tests.ts --module commonjs --noImplicitAny
var React = require('react');
var t = require('tcomb-form');
var bootstrap = require('tcomb-form/lib/skins/bootstrap');
// pluggable skins
t.form.config.templates = bootstrap;
// API
var form = t.form;
var config = t.form.config;
var templates = t.form.config.templates;
var i18n = t.form.config.i18n;
var Select = t.form.Select;
var Radio = t.form.Radio;
var Form = t.form.Form;
// instance
var factory = React.createFactory(Form);
factory({
    type: t.struct({
        name: t.Str
    }),
    options: {
        auto: 'labels'
    }
});
