import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  actions: {
    sortEndAction() {
      let results = this.get('results');

      results.forEach((result) => {
        result.style.zIndex = 0;
      });
      results[0].style.zIndex = 111;
    }
  },
});
