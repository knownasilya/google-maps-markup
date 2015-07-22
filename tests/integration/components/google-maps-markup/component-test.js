import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('google-maps-markup', 'Integration | Component | google maps markup', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{google-maps-markup}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#google-maps-markup}}
      template block text
    {{/google-maps-markup}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
