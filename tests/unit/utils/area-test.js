import area from 'google-maps-markup/utils/area';
import { module, test } from 'qunit';

module('Unit | Utility | area', function () {
  test('over threshold - one level', function (assert) {
    let input = {
      value: 60000,
      unit: {
        id: 'sq ft',
      },
      measurementType: 'Area',
    };
    let result = area(input);

    assert.deepEqual(result, {
      value: 1.4,
      unit: 'acres',
      measurementType: input.measurementType,
    });
  });

  test('over threshold - two levels', function (assert) {
    let input = {
      value: 27980000,
      unit: {
        id: 'sq ft',
      },
      measurementType: 'Area',
    };
    let result = area(input);

    assert.deepEqual(result, {
      value: 1,
      unit: 'sq mi',
      measurementType: input.measurementType,
    });
  });

  test('below threshold', function (assert) {
    let input = {
      value: 2000,
      unit: {
        id: 'sq ft',
      },
      measurementType: 'Area',
    };
    let result = area(input);

    assert.deepEqual(result, {
      value: 2000,
      unit: 'sq ft',
      measurementType: input.measurementType,
    });
  });
});
