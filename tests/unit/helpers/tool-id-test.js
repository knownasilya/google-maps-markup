
import { toolId } from 'dummy/helpers/tool-id';
import { module, test } from 'qunit';

module('Unit | Helper | tool id');

test('it works with id', function(assert) {
  let result = toolId([{ id: 'test' }]);
  assert.equal(result, 'test');
});

test('it works with type', function(assert) {
  let result = toolId([{ type: 'test' }]);
  assert.equal(result, 'test');
});

