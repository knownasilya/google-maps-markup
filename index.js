'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/google-maps-markup/styles.css');
  },

  isDevelopingAddon() {
    return process.env.DEVELOPING === 'true';
  },
};
