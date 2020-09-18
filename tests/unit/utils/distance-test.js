import distance from '../../../utils/distance';
import { module, test } from 'qunit';

module('Unit | Utility | miles', function () {
  // Replace this with your real tests.
  test('it works', function (assert) {
    var input = {
      value: 2000,
      unit: 'ft.',
      measurementType: 'Distance',
    };
    var result = distance(input);

    assert.deepEqual(result, {
      value: 0.3788,
      unit: 'mi.',
      measurementType: input.measurementType,
    });
  });
});
