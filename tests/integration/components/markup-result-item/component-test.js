import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


module('Integration | Component | markup result item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('data', {
      mode: 'draw',
      type: 'circle'
    });

    await render(hbs`{{markup-result-item data=data}}`);

    let text = find('*').textContent.trim().split('\n').join(' ').replace(/\s/g, '');

    assert.equal(text, 'circleEditRemove');
  });
});
