import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('gmm-markup-results', 'Integration | Component | gmm markup results', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gmm-markup-results}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#gmm-markup-results}}
      template block text
    {{/gmm-markup-results}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
