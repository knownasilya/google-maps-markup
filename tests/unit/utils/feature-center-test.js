import featureCenter from '../../../utils/feature-center';
import { module, test } from 'qunit';

module('Unit | Utility | feature center', function () {
  test('point', function (assert) {
    var feature = new google.maps.Data.Feature({
      geometry: new google.maps.Data.Point({
        lat: 40.509622849596695,
        lng: -75.5474853515625,
      }),
    });
    var result = featureCenter(feature);

    assert.equal(result.lat(), 40.509622849596695);
    assert.equal(result.lng(), -75.5474853515625);
  });

  test('polygon', function (assert) {
    var feature = new google.maps.Data.Feature({
      geometry: new google.maps.Data.Polygon([
        [
          { lat: 42.52677220056902, lng: -71.114501953125 },
          { lat: 42.4923525914282, lng: -71.14471435546875 },
          { lat: 42.49336520339777, lng: -71.06369018554688 },
        ],
      ]),
    });
    var result = featureCenter(feature);

    assert.equal(result.lat(), 42.509562395998614);
    assert.equal(result.lng(), -71.10420227050781);
  });

  test('linestring', function (assert) {
    var feature = new google.maps.Data.Feature({
      geometry: new google.maps.Data.LineString([
        { lat: 42.5338562378485, lng: -71.15982055664062 },
        { lat: 42.5338562378485, lng: -71.05545043945312 },
        { lat: 42.503490421367296, lng: -71.08291625976562 },
      ]),
    });
    var result = featureCenter(feature);

    assert.equal(result.lat(), 42.51867332960789);
    assert.equal(result.lng(), -71.10763549804688);
  });
});
