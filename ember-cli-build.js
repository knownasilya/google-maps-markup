'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  let fontsDir = path.dirname(require.resolve('font-awesome/package.json'));
  let fonts = funnel(fontsDir, {
    srcDir: 'fonts',
    destDir: 'assets/fonts',
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return mergeTrees([maybeEmbroider(app), fonts]);
};
