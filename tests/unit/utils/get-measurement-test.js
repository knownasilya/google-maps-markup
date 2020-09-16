import getMeasurement from '../../../utils/get-measurement';
import { module, test } from 'qunit';

module('Unit | Utility | get measurement', function() {
  test('polyline', function(assert) {
    var feature = new google.maps.Data.Feature({
      geometry: new google.maps.Data.LineString([
        { lat: 42.5338562378485, lng: -71.15982055664062 },
        { lat: 42.5338562378485, lng: -71.05545043945312 },
        { lat: 42.503490421367296, lng: -71.08291625976562 }
      ])
    });
    var result = getMeasurement('polyline', feature);

    assert.ok(result.value);
    assert.ok(result.unit);
    assert.ok(result.measurementType);
  });

  test('polygon', function(assert) {
    var feature = new google.maps.Data.Feature({
      geometry: new google.maps.Data.Polygon([
        [
          { lat: 42.52677220056902, lng: -71.114501953125 },
          { lat: 42.4923525914282, lng: -71.14471435546875 },
          { lat: 42.49336520339777, lng: -71.06369018554688 }
        ]
      ])
    });
    var result = getMeasurement('polygon', feature);

    assert.ok(result.value);
    assert.ok(result.unit);
    assert.ok(result.measurementType);
  });
});

