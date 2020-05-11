import mapLabelFactory from './map-label';
let DynamicLabelLocal;

function createDynamicLabel() {
  if (DynamicLabelLocal) {
    return DynamicLabelLocal;
  }
  const MapLabel = mapLabelFactory();

  class DynamicLabel extends MapLabel {
    constructor(latlng, options) {
      options = options || {};

      options.element = document.createElement('textarea');
      options.element.placeholder = options.placeholder || 'Text Here';
      options.element.rows = 1;
      options.element.wrap = 'hard';

      super(latlng, options);

      this.autoFocus = options.autoFocus || false;
      this.editLabelInPlace = options.editLabelInPlace;
      this.center = false;

      if (this.editLabelInPlace === undefined) {
        this.editLabelInPlace = true;
      }

      this.fontSize = options.fontSize;
      this.label = options.label;
    }

    onAdd() {
      let panes = this.getPanes();
      let pane = panes.overlayMouseTarget;
      let map = this.getMap();

      if (pane) {
        pane.appendChild(this._element);

        if (this.autoFocus) {
          this._element.focus();
        }
      }

      if (this.editLabelInPlace) {
        //this._element.contentEditable = true;
        google.maps.event.addDomListener(this._element, 'keydown', (event) => {
          // left, up, right, down, equal, minus
          let blockedKeys = [37, 38, 39, 40, 187, 189];

          if (blockedKeys.indexOf(event.keyCode) !== -1) {
            event.stopPropagation();
          }
        });
        google.maps.event.addDomListener(this._element, 'dblclick', (event) => {
          event.stopPropagation();
        });
        google.maps.event.addDomListener(
          this._element,
          'mousemove',
          (event) => {
            event.stopPropagation();
          }
        );
        google.maps.event.addDomListener(this._element, 'click', (event) => {
          this._element.focus();
          event.stopPropagation();
        });
        google.maps.event.addDomListener(this._element, 'focusin', (event) => {
          this.editingText = true;
          event.stopPropagation();
        });
        google.maps.event.addDomListener(this._element, 'select', (event) => {
          event.stopPropagation();
        });

        google.maps.event.addDomListener(this._element, 'blur', (event) => {
          let contentBlank =
            !!this.label.length && this.label.trim().length === 0;

          if (!contentBlank) {
            this.editingText = false;
          }

          google.maps.event.trigger(this, 'focusout');
          event.stopPropagation();
        });

        google.maps.event.addDomListener(this._element, 'input', (event) => {
          google.maps.event.trigger(this, 'changelabel');
          this.updateSize();

          if (map) {
            google.maps.event.trigger(map, 'resize');
          }
          event.stopPropagation();
        });
      }
    }

    draw() {
      super.draw();
      this.updateSize();
    }

    updateSize() {
      if (!document.body) {
        return;
      }

      let content = this.label;
      let fontSize = Number(this.fontSize.replace('px', ''));
      let contentLines = content.split(/\r|\n/);
      let contentHeight = contentLines.length * fontSize;
      let contentWidth = contentLines.reduce((total, line) => {
        let div = document.createElement('div');

        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.fontSize = this.fontSize;
        div.style.height = 'auto';
        div.style.width = 'auto';
        div.style.whiteSpace = 'nowrap';
        div.textContent = line;
        document.body.appendChild(div);

        let width = div.clientWidth;

        document.body.removeChild(div);

        if (width > total) {
          total = width;
        }

        return total;
      }, 100);

      content = content.replace(/\n/g, '<br/>');

      this._element.style.height = contentHeight + 10 + 'px';
      this._element.style.width = contentWidth + 20 + 'px';
    }

    set editingText(val) {
      if (val) {
        this._element.classList.add('editing-text');
      } else {
        this._element.classList.remove('editing-text');
      }

      this._editingText = val;
    }

    get editingText() {
      return this._editingText;
    }

    set label(value) {
      this._element.value = value || '';
    }

    get label() {
      return this._element.value;
    }

    set fontSize(value = 12) {
      this._element.style.fontSize = value + 'px';
      this.updateSize();
    }

    get fontSize() {
      return this._element.style.fontSize;
    }

    onRemove() {
      /*
    this._element.removeEventListener('keydown');
    this._element.removeEventListener('dblclick');
    this._element.removeEventListener('click');
    this._element.removeEventListener('focusin');
    this._element.removeEventListener('focusout');
    this._element.removeEventListener('mousemove');
    this._element.removeEventListener('input');
    */
      google.maps.event.clearInstanceListeners(this._element);

      super.onRemove(...arguments);
    }
  }

  DynamicLabelLocal = DynamicLabel;
  return DynamicLabelLocal;
}

export default createDynamicLabel;
