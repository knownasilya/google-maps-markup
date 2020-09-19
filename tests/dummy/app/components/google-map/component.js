import Component from '@ember/component';

export default Component.extend({
  map: null,

  init() {
    this._super(...arguments);
    this.center = new google.maps.LatLng(42.43540000000001, -71.11295997924805);
  },

  didInsertElement() {
    let center = this.center;
    let zoom = this.zoom;
    let el = this.element.querySelector('#map');

    this.setup(el, center, zoom);
  },

  setup(el, center, zoom = 10) {
    let map;

    google.maps.visualRefresh = true;

    let options = {
      zoom,
      center,
      maxZoom: 19,
      gestureHandling: 'greedy',
    };

    map = new google.maps.Map(el, options);

    // debugging
    window.gmap = map;

    this.setProperties({
      map: map,
    });

    return map;
  },
});
