var t = require('tcomb-validation');

var Form = require('./components/Form');

t.form = {
  debug:    require('debug'),
  config:   Form,
  Form:     Form,
  Textbox:  require('./components/Textbox'),
  Select:   require('./components/Select'),
  Checkbox: require('./components/Checkbox'),
  Radio:    require('./components/Radio'),
  Struct:   require('./components/Struct'),
  List:     require('./components/List')
};

module.exports = t;