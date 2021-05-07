import classic from 'ember-classic-decorator';
import {
  classNames,
  layout as templateLayout,
} from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';
import optionsData from '../../utils/options-data';

@classic
@templateLayout(layout)
@classNames('tool-options')
export default class GmmToolOptions extends Component {
  optionsData = optionsData;
}
