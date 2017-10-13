import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

export function toolId([tool]/*, hash*/) {
  return get(tool, 'id') || get(tool, 'type');
}

export default helper(toolId);
