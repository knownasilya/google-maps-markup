import { isEqual } from '../../../helpers/is-equal';
import { module, test } from 'qunit';

module('Unit | Helper | is equal', function () {
  test('it works for equality', function (assert) {
    let result = isEqual(42, 42);
    assert.ok(result);
  });

  test('it works for inequality', function (assert) {
    let result = isEqual(42, 41);
    assert.ok(result);
  });
});
