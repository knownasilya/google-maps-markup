import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('markup-result-item', 'Integration | Component | markup result item', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('data', {
    type: 'circle'
  });

  this.render(hbs`{{markup-result-item data=data}}`);

  assert.equal(this.$().text().trim().split('\n').join(' '), 'circle Remove');
});
