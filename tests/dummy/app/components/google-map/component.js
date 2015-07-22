import Ember from 'ember';

const {
  on,
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  map: null,
  center: new google.maps.LatLng(42.43540000000001, -71.11295997924805),

  initMap: on('didInsertElement', function () {
    var center = this.get('center');
    var zoom = this.get('zoom');
    var el = this.$('#map').get(0);

    this.setup(el, center, zoom);
  }),

  setup: function (el, center, zoom) {
    var map;

    google.maps.visualRefresh = true;

    var options = {
      zoom: zoom || 10,
      maxZoom: 19,
      center: center
    };

    map = new google.maps.Map(el, options);

    // debugging
    window.gmap = map;

    this.setProperties({
      map: map
    });

    return map;
  }
});
