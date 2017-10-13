import Component from '@ember/component';
import { on } from '@ember/object/evented';

export default Component.extend({
  map: null,
  center: new google.maps.LatLng(42.43540000000001, -71.11295997924805),

  initMap: on('didInsertElement', function () {
    var center = this.get('center');
    var zoom = this.get('zoom');
    var el = this.$('#map').get(0);

    this.setup(el, center, zoom);
  }),

  setup(el, center, zoom = 10) {
    var map;

    google.maps.visualRefresh = true;

    var options = {
      zoom,
      center,
      maxZoom: 19,
      gestureHandling: 'greedy'
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
