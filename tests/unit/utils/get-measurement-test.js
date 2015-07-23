import getMeasurement from '../../../utils/get-measurement';
import { module, test } from 'qunit';

module('Unit | Utility | get measurement');

// Replace this with your real tests.
test('polyline', function(assert) {
  var feature = mockFeature();
  var result = getMeasurement('polyline', feature);
  assert.ok(result.value);
  assert.ok(result.unit);
  assert.ok(result.measurementType);
});

function mockFeature() {
  return {
    getGeometry() {
      return {
        getArray() {
          return [];
        }
      };
    }
  };
}
