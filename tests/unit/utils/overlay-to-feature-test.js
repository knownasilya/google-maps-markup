import overlayToFeature from '../../../utils/overlay-to-feature';
import { module, test } from 'qunit';

const LatLng = google.maps.LatLng;

module('Unit | Utility | overlay to feature', function () {
  // Replace this with your real tests.
  test('it works', function (assert) {
    var circleOverlay = {
      radius: 3947.236927961412,

      getCenter() {
        return new LatLng(42.48019996901214, -71.10763549804688);
      },
    };

    var rectangleOverlay = {
      getBounds() {
        return {
          getNorthEast() {
            return new LatLng(42.532844281713125, -71.02523803710938);
          },
          getSouthWest() {
            return new LatLng(42.46095348879495, -71.19827270507812);
          },
        };
      },
    };

    var circle = overlayToFeature('circle', circleOverlay);
    assert.ok(circle.getGeometry());

    var rectangle = overlayToFeature('rectangle', rectangleOverlay);
    assert.ok(rectangle.getGeometry());
  });
});
