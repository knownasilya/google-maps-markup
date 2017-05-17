import Ember from 'ember';

const { get } = Ember;

export function toolId([tool]/*, hash*/) {
  return get(tool, 'id') || get(tool, 'type');
}

export default Ember.Helper.helper(toolId);
