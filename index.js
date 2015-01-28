var t = require('./lib');

// plug bootstrap skin
t.form.config.templates = require('./lib/skins/bootstrap');

module.exports = t;