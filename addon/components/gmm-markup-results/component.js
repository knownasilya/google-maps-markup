import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout: layout,

  actions: {
    sortEndAction() {
      let results = this.results;

      results.forEach((result) => {
        result.style.zIndex = 0;
      });
      results[0].style.zIndex = 111;
    }
  },
});
