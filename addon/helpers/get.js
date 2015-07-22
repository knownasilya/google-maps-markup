import Ember from 'ember';

export function get(params/*, hash*/) {
  var source = params[0];

  return source ? source[params[1]] : undefined;
}

export default Ember.Helper.helper(get);
