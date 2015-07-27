import Ember from 'ember';
import layout from './template';
import overlayToFeature from '../../utils/overlay-to-feature';
import MODE from '../../utils/modes';
import DRAWING_MODE from '../../utils/drawing-modes';

if (!window.google) {
  throw new Error('Sorry, but `google` defined globally is required for this addon');
}

const {
  on,
  run,
  computed,
  A: boundArray,
  observer: observes
} = Ember;

export default Ember.Component.extend({
  classNames: ['knownasilya--google-maps-markup'],
  layout: layout,
  dm: new google.maps.drawing.DrawingManager({
    drawingControl: false
  }),
  dataLayers: [
    { isHidden: false, data: new google.maps.Data() },
    { isHidden: false, data: new google.maps.Data() }
  ],
  markupResults: Ember.Object.create({
    draw: boundArray(),
    measure: boundArray()
  }),
  resultsHidden: false,
  activeLayer: undefined,
  drawingMode: DRAWING_MODE.pan.id,
  mode: MODE.draw.id,
  modes: [
    MODE.draw,
    MODE.measure
  ],
  drawingModes: [
    DRAWING_MODE.pan,
    DRAWING_MODE.marker,
    DRAWING_MODE.polyline,
    DRAWING_MODE.circle,
    DRAWING_MODE.rectangle,
    DRAWING_MODE.polygon
  ],
  measureModes: [
    DRAWING_MODE.pan,
    DRAWING_MODE.polyline,
    DRAWING_MODE.circle,
    DRAWING_MODE.rectangle,
    DRAWING_MODE.polygon
  ],

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

  getTool(id) {
    var mode = this.get('mode');

    if (mode === 'pan') {
      return;
    }

    return DRAWING_MODE[id];
  },

  actions: {
    changeMode(mode) {
      this.set('mode', mode.id);
    },

    changeDrawingMode(mode) {
      var activeLayer = this.get('activeLayer');
      var dm = this.get('dm');
      var tool = this.getTool(mode);

      if (activeLayer) {
        if (tool.id === 'pan') {
          activeLayer.data.setDrawingMode(null);
          dm.setDrawingMode(null);
        } else if (tool.dataId) {
          activeLayer.data.setDrawingMode(tool.dataId);
        } else if (tool.dmId) {
          let map = this.get('map');

          dm.setDrawingMode(tool.dmId);
          dm.setMap(map);
        }
      }

      this.set('drawingMode', mode);
    },

    toggleResults() {
      var isHidden = this.toggleProperty('resultsHidden');
      var activeLayer = this.get('activeLayer');
      var map = this.get('map');

      if (!isHidden) {
        activeLayer.data.setMap(map);
      } else {
        activeLayer.data.setMap(null);
      }

      activeLayer.isHidden = isHidden;
    },

    clearResults() {
      if (confirm('This cannot be undone, are you sure you want to clear all markup for this mode?')) {
        let layer = this.get('activeLayer');

        layer.data.forEach((feature) => {
          layer.data.remove(feature);
        });

        this.set('results', boundArray());
      }
    },

    removeResult(result) {
      var results = this.get('results');
      var layer = this.get('activeLayer');

      layer.data.remove(result.feature);

      this.set('results', results.without(result));
    },

    highlightResult(data) {
      var layer = this.get('activeLayer');
      var style;

      if (data.type === 'marker') {
        style = {
          icon: {
            url: '/google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
            scaledSize: new google.maps.Size(22, 40)
          }
        };
      } else {
        style = {
          strokeColor: 'red'
        };
      }

      layer.data.overrideStyle(data.feature, style);
    },

    resetResultStyle(data) {
      var layer = this.get('activeLayer');

      layer.data.revertStyle(data.feature);
    }
  },

  changeLayer: on('init', observes('mode', 'map', function () {
    var modeId = this.get('mode');
    var map = this.get('map');
    var drawingModeId = this.get('drawingMode');
    var dataLayers = this.get('dataLayers');
    var activeLayer = this.get('activeLayer');

    this.set('lastActiveLayer', activeLayer);

    if (modeId === MODE.draw.id || modeId === MODE.measure.id) {
      let tool = this.getTool(drawingModeId);

      activeLayer = dataLayers[modeId === MODE.draw.id ? 0 : 1];

      if (!activeLayer.isHidden) {
        activeLayer.data.setMap(map);
      }

      activeLayer.data.setDrawingMode(tool.dataId);

      this.set('activeLayer', activeLayer);
    }
  })),

  activeLayerSetup: observes('activeLayer', function () {
    var mode = this.get('mode');
    var layer = this.get('activeLayer');
    var lastLayer = this.get('lastActiveLayer');

    if (!layer) {
      return;
    }

    if (lastLayer) {
      google.maps.event.clearListeners(lastLayer.data, 'addfeature');
    }

    var listener = layer.data.addListener('addfeature', run.bind(this, (event) => {
      let drawingMode = this.get('drawingMode');
      let results = this.get('results');

      results.pushObject({ mode: mode, type: drawingMode, feature: event.feature });
    }));


    this.set('addFeatureListener', listener);
  }),

  setup: on('didInsertElement', function () {
    var dm = this.get('dm');

    this.set('mode', MODE.draw.id);

    let listener = dm.addListener('overlaycomplete', run.bind(this, (event) => {
      var activeLayer = this.get('activeLayer');
      var feature = overlayToFeature(event.type, event.overlay);

      event.overlay.setMap(null);

      activeLayer.data.add(feature);
    }));

    this.set('dmListener', listener);
  }),

  teardown: on('willDestroyElement', function () {
    var dataLayers = this.get('dataLayers');
    var dmListener = this.get('dmListener');

    // Cleanup all data layer events
    if (dataLayers) {
      dataLayers.forEach(layer => {
        google.maps.event.clearListeners(layer, 'addfeature');
      });
    }

    // Cleanup drawing manager events
    if (dmListener) {
      google.maps.event.clearListeners(dmListener, 'overlaycomplete');
    }
  })
});
