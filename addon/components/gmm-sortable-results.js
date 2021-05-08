import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class GmmSortableResults extends Component {
  @action
  sortEndAction() {
    let results = this.args.results;

    results.forEach((result) => {
      result.style.zIndex = 0;
    });
    results[0].style.zIndex = 111;
  }
}
