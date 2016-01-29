import Ember from 'ember';
import layout from './template';
import MODE from '../../utils/modes';
import getMeasurement from '../../utils/get-measurement';
import featureCenter from '../../utils/feature-center';

const {
  on,
  run,
  computed
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: 'li',
  classNames: ['list-group-item', 'clearfix'],

  didInitAttrs() {
    var data = this.get('data');

    if (data.feature.addListener) {
      let changeListener = data.feature.addListener('changelabel', () => {
        this.set('description', data.feature.label);
      });

      this.set('changeListener', changeListener);
    }
  },

  description: computed('data.mode', 'data.feature', {
    get() {
      var mode = this.get('data.mode');
      var data = this.get('data');

      if (mode === MODE.measure.id) {
        let m = getMeasurement(data.type, data.feature);
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
      var data = this.get('data');
      var wormhole = this.get('wormhole');

      this.sendAction('onedit', data, wormhole, position);
    },

    toggleEditShape() {
      var edit = this.toggleProperty('data.editingShape');
      var data = this.get('data');
      var listener;

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
          this.set('shapeModified', false);
          if (listener) {
            google.maps.event.removeListener(listener);
          }
        }
      }

      this.set('data', data);
    },

    cancelEditShape() {
      var data = this.get('data');
      var shapeModified = this.get('shapeModified');
      var originalGeometry = this.get('originalFeatureGeometry');

      if (shapeModified && originalGeometry) {
        this.set('originalFeatureGeometry');
        this.send('toggleEditShape');
        data.feature.setGeometry(originalGeometry);
        this.set('shapeModified', false);
      }
    }
  },

  register: on('init', function () {
    var data = this.get('data');

    Ember.set(data, 'listItem', this);
  }),

  onOver: on('mouseEnter', function () {
    this.sendAction('onover', this.get('data'));
  }),

  onOut: on('mouseLeave', function () {
    this.sendAction('onout', this.get('data'));
  }),

  willDestroyElement() {
    this._super(...arguments);

    var changeListener = this.get('changeListener');

    if (changeListener) {
      google.maps.event.removeListener(changeListener);
    }
  }
});
