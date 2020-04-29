"use strict";

module.exports = {
  name: require("./package").name,

  included: function () {
    this._super.included.apply(this, arguments);

    this.import("vendor/google-maps-markup/styles.css");
  },

  isDevelopingAddon: function () {
    return process.env.DEVELOPING === "true";
  },
};
