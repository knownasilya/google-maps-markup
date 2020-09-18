import classic from 'ember-classic-decorator';
import { layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set, action, computed } from '@ember/object';
import { ChildMixin } from 'ember-composability-tools';
import layout from './template';
import MODE from '../../utils/modes';
import getMeasurement from '../../utils/get-measurement';
import featureCenter from '../../utils/feature-center';

@classic
@templateLayout(layout)
export default class MarkupResultItem extends Component.extend(ChildMixin) {
  init() {
    super.init(...arguments);

    let data = this.data;

    if (data.feature.addListener) {
      let changeListener = data.feature.addListener(
        'changelabel',
        run.bind(this, () => {
          data.geojson.properties.label = data.feature.label;
          this.set('description', data.feature.label);
        })
      );

      this.set('changeListener', changeListener);
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

    this.onedit(data, wormhole, position, this.elementId);
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
    let edit = this.toggleProperty('data.editingShape');
    let data = this.data;
    let listener;

    if (edit) {
      if (data.type === 'text') {
        this.set('originalFeatureGeometry', data.feature.position);
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
            this.set('shapeModified', true);
            this.notifyPropertyChange('description');
          })
        );
        this.set('originalFeatureGeometry', data.feature.getGeometry());
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
        this.set('shapeModified', false);
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      }
    }

    this.set('data', data);
  }

  @action
  cancelEditShape() {
    let data = this.data;
    let shapeModified = this.shapeModified;
    let originalGeometry = this.originalFeatureGeometry;

    if (shapeModified && originalGeometry) {
      this.set('originalFeatureGeometry');
      this.send('toggleEditShape');
      data.feature.setGeometry(originalGeometry);
      this.set('shapeModified', false);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    let changeListener = this.changeListener;

    if (changeListener) {
      google.maps.event.removeListener(changeListener);
    }
  }
}
