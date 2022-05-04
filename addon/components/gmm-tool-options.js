import Component from '@glimmer/component';
import { action } from '@ember/object';
import optionsData from '../utils/options-data';

export default class GmmToolOptions extends Component {
  optionsData = optionsData;

  @action
  updateOption(id, event) {
    let option = this.args.tool.options?.find((opt) => opt.id === id);
    let value =
      option?.type === 'boolean' ? event.target.checked : event.target.value;
    this.args.updateOptionValue(this.args.tool, id, value);
  }
}
