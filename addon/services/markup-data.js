import Ember from 'ember';
import createFeature from '../utils/create-feature';
import initMeasureLabel from '../utils/init-measure-label';
import MODE from '../utils/modes';

const {
  get,
  computed,
  A: boundArray
} = Ember;
const MODES = [
  MODE.draw.id,
  MODE.measure.id
];

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

  changeModeByResults() {
    var markupResults = this.get('markupResults');
    var map = this.get('map');

    for (let i = 0; i < MODES.length; i++) {
      let key = MODES[i];
      let modeResults = get(markupResults, key);

      if (modeResults && modeResults.length) {
        this.set('mode', key);
        return;
      }
    }
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
    var map = this.get('map');
    var mode = feature.getProperty('mode');
    var results = this.get(`markupResults.${mode}`);
    var result = {
      mode,
      feature,
      layer,
      type: feature.getProperty('type'),
      isVisible: feature.getProperty('isVisible')
    };

    initMeasureLabel(result, map);
    results.pushObject(result);
  }
});
