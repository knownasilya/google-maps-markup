import createCircle from '../../../utils/create-circle';
import { module, test } from 'qunit';

module('Unit | Utility | create circle', function () {
  // Replace this with your real tests.
  test('it works', function (assert) {
    var lat = 42.48019996901214;
    var lng = -71.10763549804688;
    var radius = 3947.236927961412;
    var result = createCircle(lat, lng, radius);

    assert.equal(result.length, 33);
    assert.ok(result[0].lat());
    assert.ok(result[0].lng());
  });
});
