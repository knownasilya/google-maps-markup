/* eslint-env node */
'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');
const pickFiles = require('broccoli-static-compiler');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  let fontsDir = path.join(app.bowerDirectory, 'fontawesome', 'fonts');
  let fonts = pickFiles(fontsDir, {
    srcDir: '/',
    files: ['**/*'],
    destDir: '/assets/fonts'
  });

  return mergeTrees([app.toTree(), fonts]);
};
