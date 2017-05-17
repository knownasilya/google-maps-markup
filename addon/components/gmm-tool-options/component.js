import Ember from 'ember';
import layout from './template';
import optionsData from '../../utils/options-data';

export default Ember.Component.extend({
  layout,
  classNames: ['tool-options', 'row'],
  optionsData
});
