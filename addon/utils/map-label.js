class MapLabel extends google.maps.OverlayView {
  constructor(latlng, options) {
    super(...arguments);

    options = options || {};

    this.position = latlng;

    this._opts = options;
    this._element = document.createElement('div');
    this._element.className = 'google-maps-markup-map-label';
    this._element.style.position = 'absolute';

    if (options.className) {
      this._element.className += ' ' + options.className;
    }

    if (options.defaultLabel) {
      this._element.textContent = options.defaultLabel;
    }
  }

  // Required by GMaps
  onAdd() {
    var pane = this.getPanes().markerLayer;

    if (pane) {
      pane.appendChild(this._element);
    }
  }

  // Required by GMaps
  draw() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.position);
    var div = this._element;

    if (position && position.x && position.y) {
      var latlng = projection.fromDivPixelToLatLng(position);
      var distance = google.maps.geometry.spherical.computeDistanceBetween(this.position, latlng);
      var offsetY = 88;

      if (distance < 0.00003) {
        offsetY += 100;
      } else if (distance < 0.00005) {
        offsetY += 40;
      }

      let width = this._element.clientWidth;
      let height = this._element.clientHeight;

      div.style.display = 'block';
      div.style.left = position.x - (width / 2) + 'px';
      div.style.top = position.y - (height / 2) + 'px';
    } else {
      div.style.display = 'none';
    }
  }

  // Required by GMaps
  onRemove() {
    this._element.parentNode.removeChild(this._element);
  }

  set label(value) {
    this._element.textContent = value;
  }

  get label() {
    return this._element.textContent;
  }
}

export default MapLabel;
