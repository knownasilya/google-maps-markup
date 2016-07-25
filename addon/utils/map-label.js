class MapLabel extends google.maps.OverlayView {
  constructor(latlng, options) {
    super(...arguments);

    options = options || {};

    this.latlng = latlng;
    this.dontScale = options.dontScale;
    this.options = options;

    this._element = options.element || document.createElement('div');
    this._element.className = 'google-maps-markup-map-label';
    this._element.style.position = 'absolute';

    if (options.className) {
      this._element.className += ' ' + options.className;
    }

    // Requires element to be present
    this.color = options.color;
    this.label = options.label;
    this.center = true;
  }

  // Required by GMaps
  onAdd() {
    var panes = this.getPanes();
    var pane = panes.markerLayer;

    if (pane) {
      pane.appendChild(this._element);
    }
  }

  // Required by GMaps
  draw() {
    var map = this.getMap();

    if (!map || !this.latlng) {
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
      let center = this.center;

      div.style.display = 'block';

      if (map) {
        let zoom = map.getZoom();

        this.updateScale(zoom, this.lastZoom);
        this.lastZoom = zoom;
      }

      let left = center ? position.x - (width / 2) : position.x;
      let top = center ? position.y - (height / 2) : position.y;

      div.style.left = left + 'px';
      div.style.top = top + 'px';
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

  set color(value) {
    this._element.style.color = value;
  }

  get color() {
    return this._element.style.color;
  }

  set position(value) {
    this.latlng = value;
    this.draw();
  }

  get position() {
    return this.latlng;
  }

  get visible() {
    return this._element.style.display === 'none' ? false : true;
  }

  hide() {
    this._element.style.display = 'none';
  }

  show() {
    this._element.style.display = 'block';
  }

  updateScale(newZoom, oldZoom) {
    if (this.dontScale) {
      return;
    }

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

  highlight() {
    this._element.classList.add('highlighted');
  }

  clearHighlight() {
    this._element.classList.remove('highlighted');
  }
}

export default MapLabel;
