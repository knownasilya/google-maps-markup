import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { set, action, computed } from '@ember/object';
import { Node } from 'ember-composability-tools';
import getMeasurement from '../utils/get-measurement';
import featureCenter from '../utils/feature-center';

export default class GmmResultItem extends Node {
  guid = guidFor(this);
  @tracked textLabel;

  constructor() {
    super(...arguments);

    let data = this.args.data;

    if (data.feature.addListener) {
      let changeListener = data.feature.addListener('changelabel', () => {
        data.geojson.properties.label = data.feature.label;
        this.textLabel = data.feature.label;
      });

      this.changeListener = changeListener;
    }
  }

  @computed('data.feature', 'textLabel')
  get description() {
    if (this.textLabel) {
      return this.textLabel;
    }

    let data = this.args.data;

    if (data.showMeasurement) {
      let m = getMeasurement(data.type, data.feature, data.distanceUnitId);
      // update the measure label
      data.label.label = `${m.value} ${m.unit.display}`;

      return `${m.measurementType}: ${m.value} ${m.unit.display}`;
    } else if (data.type === 'text') {
      return data.feature.label;
    }

    return '';
  }

  @action
  ok() {
    let data = this.args.data;

    set(data, 'editing', false);
  }

  @action
  updateOptionValue(tool, prop, value) {
    let data = this.args.data;

    if (tool.type === 'text') {
      let [type, specific] = prop.split('.');

      if (type && type === 'style' && specific) {
        data.feature[specific] = value;
      }

      set(tool, prop, value);
    } else {
      set(tool, prop, value);

      data.layer.data.overrideStyle(data.feature, data.style);
    }
  }

  @action
  toggleEditShape() {
    let data = this.args.data;
    let edit = !data.editingShape;
    let listener;

    set(data, 'editingShape', edit);

    if (edit) {
      if (data.type === 'text') {
        this.originalFeatureGeometry = data.feature.position;
        data.feature.draggable = true;
        // TODO: implement label dragging
      } else {
        listener = google.maps.event.addListener(
          data.feature,
          'setgeometry',
          () => {
            if (data.label) {
              data.label.position = featureCenter(data.feature);
            }
            // force recalculation
            this.shapeModified = true;
            // this.notifyPropertyChange('description');
          }
        );
        this.originalFeatureGeometry = data.feature.getGeometry();
        data.layer.data.overrideStyle(data.feature, {
          editable: true,
          draggable: true,
        });
      }
    } else {
      if (data.type === 'text') {
        // TODO: implement
      } else {
        data.layer.data.revertStyle(data.feature);
        if (data.style) {
          data.layer.data.overrideStyle(data.feature, data.style);
        }
        this.shapeModified = false;
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      }
    }

    this.args.data = data;
  }

  @action
  cancelEditShape() {
    let data = this.args.data;
    let shapeModified = this.shapeModified;
    let originalGeometry = this.originalFeatureGeometry;

    if (shapeModified && originalGeometry) {
      this.originalFeatureGeometry = undefined;
      this.toggleEditShape();
      data.feature.setGeometry(originalGeometry);
      this.shapeModified = false;
    }
  }

  @action
  beforeRemove() {
    let changeListener = this.changeListener;

    if (changeListener) {
      google.maps.event.removeListener(changeListener);
    }
  }
}
