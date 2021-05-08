import Component from '@glimmer/component';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

export default class GoogleMap extends Component {
  get center() {
    return (
      this.args.center ??
      new google.maps.LatLng(42.43540000000001, -71.11295997924805)
    );
  }

  get zoom() {
    return this.args.zoom ?? 10;
  }

  @action
  setupMap(el) {
    let center = this.center;
    let zoom = this.zoom;
    let options = {
      zoom,
      center,
      maxZoom: 19,
      gestureHandling: 'greedy',
    };

    google.maps.visualRefresh = true;
    let map = new google.maps.Map(el, options);

    // debugging
    window.gmap = map;

    next(() => {
      this.args.onLoaded(map);
    });
  }
}
