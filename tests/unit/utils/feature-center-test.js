import featureCenter from '../../../utils/feature-center';
import { module, test } from 'qunit';

module('Unit | Utility | feature center');

// Replace this with your real tests.
test('it works', function(assert) {
  var feature = new google.maps.Data.Feature({
    geometry: new google.maps.Data.Point({
      lat: 40.509622849596695,
      lng: -75.5474853515625
    })
  });
  var result = featureCenter(feature);

  assert.equal(result.lat(), 40.509622849596695);
  assert.equal(result.lng(), -75.5474853515625);
});
