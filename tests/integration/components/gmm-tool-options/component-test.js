import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gmm-tool-options', 'Integration | Component | gmm tool options', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gmm-tool-options}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gmm-tool-options}}
      template block text
    {{/gmm-tool-options}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
