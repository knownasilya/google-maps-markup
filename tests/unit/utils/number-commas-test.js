import numberCommas from '../../../utils/number-commas';
import { module, test } from 'qunit';

module('Unit | Utility | number commas');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = numberCommas(1234);
  assert.equal(result, '1,234');
});
