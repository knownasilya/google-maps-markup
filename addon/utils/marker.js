import MarkerLabel from './marker-label';

class Marker extends google.maps.OverlayView {
  constructor(options) {
    super(...arguments);

    this.icon = options.icon;

    if (options.map_icon_label) {
      this.MarkerLabel = new MarkerLabel({
        position: options.position,
        map: this.map,
        marker: this,
        text: options.map_icon_label
      });
    }
  }

  // Custom Marker SetMap
  setMap() {
    (this.MarkerLabel) && this.MarkerLabel.setMap.apply(this.MarkerLabel, arguments);
  }
}

export default Marker;
