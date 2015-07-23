import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'li',
  classNames: ['list-group-item', 'clearfix'],

  mouseEnter(event) {
    this.sendAction('onhover', this.get('data'));
  }
});
