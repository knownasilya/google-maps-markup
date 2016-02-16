import MapLabel from './map-label';

class DynamicLabel extends MapLabel {
  constructor(latlng, options) {
    options = options || {};

    options.element = document.createElement('textarea');
    options.element.placeholder = options.placeholder || 'Text Here';
    options.element.rows = 1;
    options.element.wrap = 'hard';

    super(latlng, options);

    this._hidden = document.createElement('pre');
    this._hidden.className = 'google-maps-markup-map-hidden';
    this._hidden.innerHTML = '<span></span><br/>';

    this.autoFocus = options.autoFocus || false;
    this.editLabelInPlace = options.editLabelInPlace;
    this.center = false;

    if (this.editLabelInPlace === undefined) {
      this.editLabelInPlace = true;
    }

    this.label = options.label;
  }

  onAdd() {
    var panes = this.getPanes();
    var pane = panes.overlayMouseTarget;
    var map = this.getMap();

    if (pane) {
      pane.appendChild(this._element);
      pane.appendChild(this._hidden);

      if (this.autoFocus) {
        this._element.focus();
      }
    }

    if (this.editLabelInPlace) {
      //this._element.contentEditable = true;
      this._element.addEventListener('keydown', event => {
        // left, up, right, down, equal, minus
        var blockedKeys = [37, 38, 39, 40, 187, 189];

        if (blockedKeys.indexOf(event.keyCode) !== -1) {
          event.stopPropagation();
        }
      });
      this._element.addEventListener('dblclick', event => {
        event.stopPropagation();
      });
      this._element.addEventListener('mousemove', event => {
        event.stopPropagation();
      });
      this._element.addEventListener('click', event => {
        this._element.focus();
        event.stopPropagation();
      });
      this._element.addEventListener('focusin', event => {
        this.editingText = true;
        event.stopPropagation();
      });
      this._element.addEventListener('focusout', event => {
        var contentBlank = !!this.label.length && this.label.trim().length === 0;

        if (!contentBlank) {
          this.editingText = false;
        }
        event.stopPropagation();
      });
      this._element.addEventListener('input', (event) => {
        google.maps.event.trigger(this, 'changelabel');
        this.updateHeight();

        if (map) {
          google.maps.event.trigger(map, 'resize');
        }
        event.stopPropagation();
      });
    }
  }

  draw() {
    super.draw();
    this.updateHeight();
  }

  updateHeight() {
    let content = this.label;

    content = content.replace(/\n/g, '<br/>');

    this._hidden.innerHTML = content + '<br/>';
    this._element.style.height = this._hidden.clientHeight + 'px';
    this._element.style.width = (this._hidden.clientWidth + 5) + 'px';
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

  get label() {
    return this._element.value;
  }

  set label(value) {
    this._element.value = value || '';
  }

  onRemove() {
    this._element.removeEventListener('keydown');
    this._element.removeEventListener('dblclick');
    this._element.removeEventListener('click');
    this._element.removeEventListener('focusin');
    this._element.removeEventListener('focusout');
    this._element.removeEventListener('mousemove');
    this._element.removeEventListener('input');

    super.onRemove(...arguments);
    this._hidden.parentNode.removeChild(this._hidden);
  }
}

export default DynamicLabel;
