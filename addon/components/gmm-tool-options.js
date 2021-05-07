import Component from '@glimmer/component';
import { action } from '@ember/object';
import optionsData from '../utils/options-data';

export default class GmmToolOptions extends Component {
  optionsData = optionsData;

  @action
  updateOpacity(id, event) {
    this.args.updateOptionValue(this.args.tool, id, event.target.value);
  }
}
