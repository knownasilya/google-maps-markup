import Ember from 'ember';
import createFeature from '../utils/create-feature';
import MODE from '../utils/modes';

const {
  computed,
  A: boundArray
} = Ember;

export default Ember.Service.extend({
  mode: MODE.draw.id,
  markupResults: Ember.Object.create({
    draw: boundArray(),
    measure: boundArray()
  }),

  activate(map) {
    this.set('map', map);

    var layers = this.get('layers');

    // Enable all layers to show on map
    layers.forEach(layer => layer.data.setMap(map));
  },

  layers: computed({
    get() {
      var results = this.get('results');
      var setId = function (geom) {
        return createFeature(geom, results);
      };

      return [
        { isHidden: false, data: new google.maps.Data({ featureFactory: setId }) },
        { isHidden: false, data: new google.maps.Data({ featureFactory: setId }) }
      ];
    }
  }),

  results: computed('mode', {
    get() {
      var mode = this.get('mode');

      if (!mode) {
        return;
      }

      return this.get(`markupResults.${mode}`);
    },
    set(key, data) {
      var mode = this.get('mode');

      if (!mode) {
        return;
      }

      this.set(`markupResults.${mode}`, data);

      return data;
    }
  }),

  featureToResult(feature, layer) {
    var mode = feature.getProperty('mode');
    var results = this.get(`markupResults.${mode}`);

    results.pushObject({
      mode,
      feature,
      layer,
      type: feature.getProperty('type'),
      isVisible: feature.getProperty('isVisible')
    });
  }
});
