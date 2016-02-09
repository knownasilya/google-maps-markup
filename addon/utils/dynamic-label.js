import MapLabel from './map-label';

class DynamicLabel extends MapLabel {
  constructor(latlng, options) {
    super(...arguments);

    this.clickable = true;
    this.placeholder = options.placeholder;
    this.editLabelInPlace = options.editLabelInPlace;

    if (this.clickable) {
      this._element.className += ' clickable';
    }
  }

  onAdd() {
    var panes = this.getPanes();
    var pane = panes.overlayMouseTarget;

    if (pane) {
      pane.appendChild(this._element);
    }

    if (this.editLabelInPlace) {
      this._element.contentEditable = true;
      this._element.addEventListener('keydown', event => {
        event.stopPropagation();
      });
      this._element.addEventListener('dblclick', event => {
        event.stopPropagation();
      });
      this._element.addEventListener('click', event => {
        this.editingText = true;
        if (!this.label) {
          this._element.textContent = '';
          this.placeholderSet = false;
        }
        event.stopPropagation();
      });
      this._element.addEventListener('focusout', event => {
        this.editingText = false;
        if (!this.label) {
          this._element.textContent = this.placeholder;
          this.placeholderSet = true;
        }
        event.stopPropagation();
      });
      this._element.addEventListener('input', () => {
        google.maps.event.trigger(this, 'changelabel');
      });
    }
  }

  draw() {
    super.draw(...arguments);

    if (!this.label && !this.editingText) {
      this._element.textContent = this.placeholder;
      this.placeholderSet = true;
    }
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
    if (this.placeholderSet) {
      return '';
    }

    return super.label;
  }

  set label(value) {
    super.label = value;
  }

  onRemove() {
    this._element.removeEventListener('keydown');
    this._element.removeEventListener('dblclick');
    this._element.removeEventListener('click');

    super.onRemove(...arguments);
  }
}

export default DynamicLabel;
