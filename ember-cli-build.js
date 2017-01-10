/*jshint node:true*/
/* global require, module */
var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // Copy fontawesome fonts
  var fontsDir = path.join(app.bowerDirectory, 'fontawesome', 'fonts');
  var fonts = pickFiles(fontsDir, {
    srcDir: '/',
    files: ['**/*'],
    destDir: '/assets/fonts'
  });

  return mergeTrees([app.toTree(), fonts]);
};
