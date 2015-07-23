import { get } from '../../../helpers/get';
import { module, test } from 'qunit';

module('Unit | Helper | get');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = get([{ test: 'test' }, 'test']);
  assert.equal(result, 'test');
});
