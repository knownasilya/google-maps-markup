import { helper } from '@ember/component/helper';

export function present([data, key]) {
  return key in data;
}

export default helper(present);
