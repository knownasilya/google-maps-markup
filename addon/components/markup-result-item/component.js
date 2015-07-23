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
        return `${m.measurementType}: ${m.value} ${m.unit}`;
      }
    }
  }),

  onOver: on('mouseEnter', function () {
    this.sendAction('onover', this.get('data'));
  }),

  onOut: on('mouseLeave', function () {
    this.sendAction('onout', this.get('data'));
  })
});
