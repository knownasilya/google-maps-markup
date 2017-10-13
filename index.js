/* eslint-env node */
'use strict';

module.exports = {
  name: 'google-maps-markup',

  included: function(app, parentAddon) {
    var target = (parentAddon || app);

    this._super.included.apply(this, arguments);

    target.import('vendor/google-maps-markup/styles.css');
  },

  isDevelopingAddon: function() {
    return process.env.DEVELOPING === 'true';
  }
};
