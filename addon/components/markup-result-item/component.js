import Ember from 'ember';
import { ChildMixin } from 'ember-composability-tools';
import layout from './template';
import MODE from '../../utils/modes';
import getMeasurement from '../../utils/get-measurement';
import featureCenter from '../../utils/feature-center';

const {
  on,
  run,
  set,
  computed
} = Ember;

export default Ember.Component.extend(ChildMixin, {
  layout: layout,
  tagName: 'li',
  classNames: ['list-group-item', 'clearfix'],

  init() {
    this._super(...arguments);

    let data = this.get('data');

    if (data.feature.addListener) {
      let changeListener = data.feature.addListener('changelabel', run.bind(this, () => {
        data.geojson.properties.label = data.feature.label;
        this.set('description', data.feature.label);
      }));

      this.set('changeListener', changeListener);
    }
  },

  description: computed('data.mode', 'data.feature', {
    get() {
      let mode = this.get('data.mode');
      let data = this.get('data');

      if (mode === MODE.measure.id) {
        let m = getMeasurement(data.type, data.feature, data.distanceUnit);
        // update the measure label
        data.label.label = `${m.value} ${m.unit}`;

        return `${m.measurementType}: ${m.value} ${m.unit}`;
      } else if (data.type === 'text') {
        return data.feature.label;
      }
    }
  }),

  actions: {
    edit(position) {
      let data = this.get('data');
      let wormhole = this.get('wormhole');

      this.sendAction('onedit', data, wormhole, position);
    },

    toggleEditShape() {
      let edit = this.toggleProperty('data.editingShape');
      let data = this.get('data');
      let listener;

      if (edit) {
        if (data.type === 'text') {
          this.set('originalFeatureGeometry', data.feature.position);
          data.feature.draggable = true;
          // TODO: implement label dragging
        } else {
          listener = google.maps.event.addListener(data.feature, 'setgeometry', run.bind(this, function () {
            if (data.label) {
              data.label.position = featureCenter(data.feature);
            }
            // force recalculation
            this.set('shapeModified', true);
            this.notifyPropertyChange('description');
          }));
          this.set('originalFeatureGeometry', data.feature.getGeometry());
          data.layer.data.overrideStyle(data.feature, {
            editable: true,
            draggable: true
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
    },

    cancelEditShape() {
      let data = this.get('data');
      let shapeModified = this.get('shapeModified');
      let originalGeometry = this.get('originalFeatureGeometry');

      if (shapeModified && originalGeometry) {
        this.set('originalFeatureGeometry');
        this.send('toggleEditShape');
        data.feature.setGeometry(originalGeometry);
        this.set('shapeModified', false);
      }
    }
  },

  onOver: on('mouseEnter', function () {
    this.sendAction('onover', this.get('data'));
  }),

  onOut: on('mouseLeave', function () {
    this.sendAction('onout', this.get('data'));
  }),

  willDestroyElement() {
    this._super(...arguments);

    let changeListener = this.get('changeListener');

    if (changeListener) {
      google.maps.event.removeListener(changeListener);
    }
  }
});
