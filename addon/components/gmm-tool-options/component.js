import Component from '@ember/component';
import layout from './template';
import optionsData from '../../utils/options-data';

export default Component.extend({
  layout,
  classNames: ['tool-options'],
  optionsData,
});
