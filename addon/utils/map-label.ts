let MapLabelLocal;

export type MapLabelOptions = {
  dontScale?: boolean;
  element?: HTMLElement;
  className?: string;
  color?: string;
  label?: string;
};

export default function mapLabelFactory() {
  if (MapLabelLocal) {
    return MapLabelLocal;
  }

  class MapLabel extends google.maps.OverlayView {
    latlng: google.maps.LatLng;
    dontScale?: boolean;
    options: MapLabelOptions;
    _element: HTMLElement;
    center = true;
    lastZoom?: number;
    scaleMaxZoom?: number;
    scale?: number;

    constructor(latlng: google.maps.LatLng, options: MapLabelOptions) {
      super();

      options = options || {};

      this.latlng = latlng;
      this.dontScale = options.dontScale;
      this.options = options;

      this._element = options.element || document.createElement('div');
      this._element.className = 'google-maps-markup-map-label set-width';
      this._element.style.position = 'absolute';
      this._element.style.transformOrigin = 'left top';

      if (options.className) {
        this._element.className += ' ' + options.className;
      }

      // Requires element to be present
      if (options.color) {
        this.color = options.color;
      }
      if (options.label) {
        this.label = options.label;
      }
    }

    // Required by GMaps
    onAdd() {
      const panes = this.getPanes();
      const pane = panes.markerLayer;

      if (pane) {
        pane.appendChild(this._element);
      }
    }

    // Required by GMaps
    draw() {
      const map = this.getMap();

      if (!map || !this.latlng) {
        return;
      }

      const projection = this.getProjection();

      if (!projection) {
        return;
      }

      const position = projection.fromLatLngToDivPixel(this.latlng);
      const div = this._element;

      if (position && position.x && position.y) {
        const width = this._element.clientWidth;
        const height = this._element.clientHeight;
        const center = this.center;

        div.style.display = 'block';

        if (map) {
          const zoom = map.getZoom();

          this.updateScale(zoom, this.lastZoom);
          this.lastZoom = zoom;
        }

        const left = center ? position.x - width / 2 : position.x;
        const top = center ? position.y - height / 2 : position.y;

        div.style.left = left + 'px';
        div.style.top = top + 'px';
      } else {
        div.style.display = 'none';
      }
    }

    // Required by GMaps
    onRemove() {
      this._element?.parentNode?.removeChild(this._element);
    }

    set label(value) {
      this._element.textContent = value || '';
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

    updateScale(newZoom: number, oldZoom?: number) {
      if (this.dontScale) {
        return;
      }

      if (oldZoom === undefined) {
        this._element.style.transform = 'scale(1)';
        this.scale = 1;
        this.scaleMaxZoom = newZoom;
        return;
      }

      if (!this.scale || !this.scaleMaxZoom) {
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

  MapLabelLocal = MapLabel;
  return MapLabelLocal;
}
