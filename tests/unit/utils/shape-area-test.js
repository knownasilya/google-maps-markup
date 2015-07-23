import { polygonArea, circleArea, rectangleArea } from '../../../utils/shape-area';
import { module, test } from 'qunit';

module('Unit | Utility | shape area');

// Replace this with your real tests.
test('polygon', function(assert) {
  var feature = '';
  var result = polygonArea(feature);
  assert.ok(result);
});
