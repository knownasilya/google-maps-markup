import Ember from 'ember';
import layout from './template';
import MODE from '../../utils/modes';
import DRAWING_MODE from '../../utils/drawing-modes';

if (!window.google) {
  throw new Error('Sorry, but `google` defined globally is required for this addon');
}

const {
  on,
  A: boundArray,
  observer: observes
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  dataLayers: [new google.maps.Data()],
  results: Ember.Object.create({
    draw: boundArray(),
    measure: boundArray()
  }),
  activeLayer: undefined,
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
    }
  },

  activeLayerSetup: observes('activeLayer', function () {
    var layer = this.get('activeLayer');

    if (!layer) {
      return;
    }

    var listener = layer.addListener('addfeature', (event) => {
      Ember.run(() => {
        console.log(event.feature);
        let mode = this.get('mode');
        let drawingMode = this.get('drawingMode');
        let results = this.get(`results.${mode}`);

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
