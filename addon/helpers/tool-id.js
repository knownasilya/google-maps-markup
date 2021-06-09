import { helper } from '@ember/component/helper';

export function toolId([tool] /*, hash*/) {
  return tool.id || tool.type;
}

export default helper(toolId);
