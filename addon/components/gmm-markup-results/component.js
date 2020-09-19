import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';

@classic
@templateLayout(layout)
export default class GmmMarkupResults extends Component {
  @action
  sortEndAction() {
    let results = this.results;

    results.forEach((result) => {
      result.style.zIndex = 0;
    });
    results[0].style.zIndex = 111;
  }
}
