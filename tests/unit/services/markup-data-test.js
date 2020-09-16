import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | markup data', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var service = this.owner.lookup('service:markup-data');
    assert.ok(service);
  });
});
