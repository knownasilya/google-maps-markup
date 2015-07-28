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
    mode: 'draw',
    type: 'circle'
  });

  this.render(hbs`{{markup-result-item data=data}}`);

  let text = this.$().text().trim().split('\n').join(' ').replace(/\s/g, '');

  assert.equal(text, 'circleEditRemove');
});
