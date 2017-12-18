import area from 'google-maps-markup/utils/area';
import { module, test } from 'qunit';

module('Unit | Utility | acres');

// Replace this with your real tests.
test('it works', function(assert) {
  var input = {
    value: 60000,
    unit: 'sq. ft.',
    measurementType: 'Area'
  };
  var result = area(input);

  assert.deepEqual(result, {
    value: 1.37741,
    unit: 'ac.',
    measurementType: input.measurementType
  });
});
