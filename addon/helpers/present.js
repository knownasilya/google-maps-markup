import Ember from 'ember';

export function present([data, key]) {
  return key in data;
}

export default Ember.Helper.helper(present);
