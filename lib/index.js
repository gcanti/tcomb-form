var t = require('tcomb-validation');

t.form = {
  debug:    require('debug'),
  config:   require('./config'),
  Form:     require('./components/Form'),
  Textbox:  require('./components/Textbox'),
  Select:   require('./components/Select'),
  Checkbox: require('./components/Checkbox'),
  Radio:    require('./components/Radio'),
  Struct:   require('./components/Struct'),
  List:     require('./components/List')
};

module.exports = t;