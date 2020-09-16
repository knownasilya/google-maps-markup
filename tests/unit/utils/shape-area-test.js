import { polygonArea } from 'google-maps-markup/utils/shape-area';
import { module, test } from 'qunit';

module('Unit | Utility | shape area', function() {
  // Replace this with your real tests.
  test('polygon', function(assert) {
    var feature = new google.maps.Data.Feature({
      geometry: new google.maps.Data.Polygon([
        [
          { lat: 40.509622849596695, lng: -75.5474853515625 },
          { lat: 40.691051628010236, lng: -75.5474853515625 },
          { lat: 40.691051628010236, lng: -75.23712158203125 },
          { lat: 40.509622849596695, lng: -75.23712158203125 }
        ]
      ])
    });
    var result = polygonArea(feature);
    console.log(result);
    assert.ok(result);
  });
});
