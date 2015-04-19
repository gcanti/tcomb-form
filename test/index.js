// setup runner title
const pkg = require('../package.json');
const title = `tcomb-form v${pkg.version} tests runner`;
document.title = title;
document.getElementById('title').innerHTML = title;

// load tests
require('./components');
require('./templates');
