import Ember from 'ember';
import layout from './template';
import MODE from '../../utils/modes';
import DRAWING_MODE from '../../utils/drawing-modes';

if (!window.google) {
  throw new Error('Sorry, but `google` defined globally is required for this addon');
}

const {
  on,
  computed,
  A: boundArray,
  observer: observes
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  dataLayers: [new google.maps.Data()],
  markupResults: Ember.Object.create({
    draw: boundArray(),
    measure: boundArray()
  }),
  activeLayer: undefined,
  resultsHidden: false,
  drawingMode: 'Point',
  mode: MODE.pan.id,
  modes: [
    MODE.pan,
    MODE.draw,
    MODE.measure
  ],
  drawingModes: [
    DRAWING_MODE.marker,
    DRAWING_MODE.polyline,
    DRAWING_MODE.polygon
  ],
  measureModes: [
    DRAWING_MODE.polyline,
    DRAWING_MODE.polygon
  ],

  results: computed('mode', {
    get() {
      var mode = this.get('mode');

      if (!mode) {
        return;
      }

      return this.get(`markupResults.${mode}`);
    }
  }),

  actions: {
    changeMode(mode) {
      var map = this.get('map');
      var drawingMode = this.get('drawingMode');
      var dataLayers = this.get('dataLayers');
      var activeLayer = this.get('activeLayer');
      var id = mode.id;

      if (mode === MODE.pan) {
        if (activeLayer) {
          activeLayer.setDrawingMode(null);
        }
      } else if (mode === MODE.draw) {
        if (!activeLayer) {
          activeLayer = dataLayers[0];
          activeLayer.setMap(map);
          this.set('activeLayer', activeLayer);
        }

        activeLayer.setDrawingMode(drawingMode);
      }

      this.set('mode', id);
    },

    changeDrawingMode(mode) {
      var activeLayer = this.get('activeLayer');

      if (activeLayer) {
        activeLayer.setDrawingMode(mode);
      }

      this.set('drawingMode', mode);
    },

    toggleResults() {
      var isHidden = this.toggleProperty('resultsHidden');
      var activeLayer = this.get('activeLayer');
      var map = this.get('map');

      if (!isHidden) {
        activeLayer.setMap(map);
      } else {
        activeLayer.setMap(null);
      }
    },

    clearResults() {
      var layer = this.get('activeLayer');

      layer.forEach((feature) => {
        layer.remove(feature);
      });

      this.set('results', boundArray());
    }
  },

  activeLayerSetup: observes('activeLayer', function () {
    var layer = this.get('activeLayer');

    if (!layer) {
      return;
    }

    var listener = layer.addListener('addfeature', (event) => {
      Ember.run(() => {
        let drawingMode = this.get('drawingMode');
        let results = this.get('results');

        results.pushObject({ type: drawingMode, feature: event.feature });
      });
    });

    this.set('addFeatureListener', listener);
  }),

  teardown: on('willDestroyElement', function () {
    var dataLayers = this.get('dataLayers');

    if (!dataLayers) {
      return;
    }

    dataLayers.forEach(layer => {
      google.maps.events.clearListeners(layer, 'addfeature');
    });
  })
});
