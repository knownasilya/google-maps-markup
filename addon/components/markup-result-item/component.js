import Ember from 'ember';
import layout from './template';
import MODE from '../../utils/modes';
import getMeasurement from '../../utils/get-measurement';

const {
  on,
  computed
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: 'li',
  classNames: ['list-group-item', 'clearfix'],

  description: computed('data.mode', {
    get() {
      var mode = this.get('data.mode');
      var data = this.get('data');

      if (mode === MODE.measure.id) {
        let m = getMeasurement(data.type, data.feature);
        data.label.label = `${m.value} ${m.unit}`;

        return `${m.measurementType}: ${m.value} ${m.unit}`;
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

      if (edit) {
        data.layer.data.overrideStyle(data.feature, {
          editable: true,
          draggable: true
        });
      } else {
        data.layer.data.revertStyle(data.feature);
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
  })
});
