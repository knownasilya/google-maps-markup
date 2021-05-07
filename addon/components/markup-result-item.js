import { run } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { set, action, computed } from '@ember/object';
import { Node } from 'ember-composability-tools';
import MODE from '../utils/modes';
import getMeasurement from '../utils/get-measurement';
import featureCenter from '../utils/feature-center';

export default class MarkupResultItem extends Node {
  @tracked description;
  @tracked data;

  constructor() {
    super(...arguments);

    let data = this.args.data;

    if (data.feature.addListener) {
      let changeListener = data.feature.addListener(
        'changelabel',
        run.bind(this, () => {
          data.geojson.properties.label = data.feature.label;
          this.description = data.feature.label;
        })
      );

      this.changeListener = changeListener;
    }
  }

  @computed('data.{mode,feature}')
  get description() {
    let mode = this.get('data.mode');
    let data = this.data;

    if (mode === MODE.measure.id) {
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
  edit(position) {
    let data = this.data;
    let wormhole = this.wormhole;

    this.args.onedit(data, wormhole, position, this.elementId);
  }

  @action
  ok() {
    let data = this.data;

    set(data, 'editing', false);
  }

  @action
  updateOptionValue(tool, prop, value) {
    if (tool.type === 'text') {
      let [type, specific] = prop.split('.');

      if (type && type === 'style' && specific) {
        this.data.feature[specific] = value;
      }

      set(tool, prop, value);
    } else {
      let data = this.data;
      set(tool, prop, value);

      data.layer.data.overrideStyle(data.feature, data.style);
    }
  }

  @action
  toggleEditShape() {
    let data = this.data;
    let edit = !data.editingShape;
    let listener;

    set(this.data, 'editingShape', edit);

    if (edit) {
      if (data.type === 'text') {
        this.originalFeatureGeometry = data.feature.position;
        data.feature.draggable = true;
        // TODO: implement label dragging
      } else {
        listener = google.maps.event.addListener(
          data.feature,
          'setgeometry',
          run.bind(this, function () {
            if (data.label) {
              data.label.position = featureCenter(data.feature);
            }
            // force recalculation
            this.shapeModified = true;
            // this.notifyPropertyChange('description');
          })
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

    this.data = data;
  }

  @action
  cancelEditShape() {
    let data = this.data;
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
