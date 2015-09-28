class MapLabel extends google.maps.OverlayView {
  constructor(latlng, options) {
    super(...arguments);

    options = options || {};

    this.latlng = latlng;

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
    var map = this.getMap();

    if (!map) {
      return;
    }

    var projection = this.getProjection();

    if (!projection) {
      return;
    }

    var position = projection.fromLatLngToDivPixel(this.latlng);
    var div = this._element;

    if (position && position.x && position.y) {
      let width = this._element.clientWidth;
      let height = this._element.clientHeight;

      div.style.display = 'block';

      if (map) {
        let zoom = map.getZoom();

        this.updateScale(zoom, this.lastZoom);
        this.lastZoom = zoom;
      }

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

  set position(value) {
    this.latlng = value;
    this.draw();
  }

  get position() {
    return this.latlng;
  }

  hide() {
    this._element.style.display = 'none';
  }

  show() {
    this._element.style.display = 'block';
  }

  updateScale(newZoom, oldZoom) {
    if (oldZoom === undefined) {
      this._element.style.transform = 'scale(1)';
      this.scale = 1;
      this.scaleMaxZoom = newZoom;
      return;
    }


    if (newZoom < oldZoom) {
      this.scale -= 0.2;
    } else if (newZoom > oldZoom) {
      this.scale += 0.2;
    }

    if (newZoom >= this.scaleMaxZoom) {
      this.scale = 1;
    }

    if (this.scale >= 0) {
      this._element.style.transform = `scale(${this.scale})`;
    }
  }
}

export default MapLabel;
