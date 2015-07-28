import squareMiles from '../../../utils/square-miles';
import { module, test } from 'qunit';

module('Unit | Utility | square miles');

// Replace this with your real tests.
test('it works', function(assert) {
  var input = {
    value: 60000,
    unit: 'sq. ft.',
    measurementType: 'Area'
  };
  var result = squareMiles(input);

  assert.deepEqual(result, {
    value: 0.0022,
    unit: 'sq. mi.',
    measurementType: input.measurementType
  });
});
