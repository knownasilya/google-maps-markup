import Service from '@ember/service';
import EmberObject, { computed, get } from '@ember/object';
import { A as boundArray } from '@ember/array';
import createFeature from '../utils/create-feature';
import initMeasureLabel from '../utils/init-measure-label';
import initTextLabel from '../utils/init-text-label';
import MODE from '../utils/modes';
import Layer from '../utils/layer';

const MODES = [
  MODE.draw.id,
  MODE.measure.id
];

export default Service.extend({
  mode: MODE.draw.id,
  markupResults: EmberObject.create({
    draw: boundArray(),
    measure: boundArray()
  }),
  textGeoJson: boundArray(),

  activate(map) {
    this.set('map', map);

    let layers = this.get('layers');
    let measureResults = this.get('markupResults.measure');

    // Enable all layers to show on map
    layers.forEach(layer => {
      layer.data.setMap(map);
    });

    // Init measure labels
    measureResults.forEach(result => {
      if (result.label) {
        result.label.setMap(map);
      } else {
        initMeasureLabel(result, map);
      }
    });
  },

  changeModeByResults() {
    let markupResults = this.get('markupResults');

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
      let results = this.get('results');
      let textGeoJson = this.get('textGeoJson');
      let setId = function (geom) {
        return createFeature(geom, results);
      };

      return [
        new Layer({
          textGeoJson,
          isHidden: false,
          data: new google.maps.Data({ featureFactory: setId })
        }),
        new Layer({
          isHidden: false,
          data: new google.maps.Data({ featureFactory: setId })
        })
      ];
    }
  }),

  results: computed('mode', {
    get() {
      let mode = this.get('mode');

      if (!mode) {
        return;
      }

      return this.get(`markupResults.${mode}`);
    },
    set(key, data) {
      let mode = this.get('mode');

      if (!mode) {
        return;
      }

      this.set(`markupResults.${mode}`, data);

      return data;
    }
  }),

  featureToResult(feature, layer) {
    let map = this.get('map');
    let textGeoJson = this.get('textGeoJson');
    let name = feature.getProperty('name');
    let mode = feature.getProperty('mode');
    let results = this.get(`markupResults.${mode}`);
    let result = {
      name,
      mode,
      feature,
      layer,
      style: feature.getProperty('style'),
      type: feature.getProperty('type'),
      isVisible: feature.getProperty('isVisible'),
      distanceUnitId: feature.getProperty('distanceUnitId')
    };

    if (result.style) {
      layer.data.overrideStyle(feature, result.style);
    }

    initMeasureLabel(result, map);
    initTextLabel(result, layer, map);

    // Put text into temp geojson table for export
    if (textGeoJson && result.type === 'text') {
      feature.toGeoJson(data => {
        result.geojson = data;
        textGeoJson.pushObject(data);
      });
    }

    results.pushObject(result);
  }
});
