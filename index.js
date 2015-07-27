/* jshint node: true */
'use strict';

module.exports = {
  name: 'google-maps-markup',

  included: function(app, parentAddon) {
    var target = (parentAddon || app);

    target.import('vendor/google-maps-markup/styles.css');
  }
};
