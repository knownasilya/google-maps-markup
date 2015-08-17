import Ember from 'ember';
import layout from './template';
import overlayToFeature from '../../utils/overlay-to-feature';
import MODE from '../../utils/modes';
import DRAWING_MODE from '../../utils/drawing-modes';
import featureCenter from '../../utils/feature-center';

if (!window.google) {
  throw new Error('Sorry, but `google` defined globally is required for this addon');
}

const {
  on,
  run,
  inject,
  computed,
  A: boundArray,
  observer: observes
} = Ember;

export default Ember.Component.extend({
  // Start Attrs
  editable: true,
  panForOffscreen: true,
  autoResetToPan: false,
  map: computed.alias('markupData.map'),
  // End Attrs

  layout: layout,
  markupData: inject.service(),
  classNames: ['knownasilya--google-maps-markup'],
  dataLayers: computed.alias('markupData.layers'),
  results: computed.alias('markupData.results'),
  mode: computed.alias('markupData.mode'),
  dm: new google.maps.drawing.DrawingManager({
    drawingControl: false
  }),
  listeners: boundArray(),
  resultsHidden: false,
  activeLayer: undefined,
  drawingMode: DRAWING_MODE.pan.id,
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

  initPopupEvents: on('init', function () {
    var editable = this.get('editable');
    if (editable) {
      let popup = new google.maps.InfoWindow();

      popup.setContent(`<div id='google-maps-markup-infowindow'></div>`);

      popup.addListener('closeclick', Ember.run.bind(this, function () {
        Ember.set(popup, 'lastData.editing', false);
        Ember.set(popup, 'lastData', undefined);
        // cleanup?
      }));

      this.set('markupEditPopup', popup);
    }
  }),

  getTool(id) {
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

      this.resetAllLayers();

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

        if (this.get('afterClearResults')) {
          this.sendAction('afterClearResults', layer);
        }
      }
    },

    removeResult(result) {
      var results = this.get('results');
      var layer = this.get('activeLayer');

      layer.data.remove(result.feature);

      this.set('results', results.without(result));
    },

    toggleResult(result) {
      var layer = this.get('activeLayer');

      if (layer.data.contains(result.feature)) {
        Ember.set(result, 'isVisible', false);
        result.feature.setProperty('isVisible', false);
        layer.data.remove(result.feature);
      } else {
        Ember.set(result, 'isVisible', true);
        result.feature.setProperty('isVisible', true);
        layer.data.add(result.feature);
      }
    },

    editResult(data, wormhole) {
      var popup = this.get('markupEditPopup');
      var map = this.get('map');
      var editable = this.get('editable');

      if (!editable) {
        return;
      }

      if (popup.getPosition()) {
        popup.close();

        if (popup.lastData) {
          Ember.set(popup, 'lastData.editing', false);
        }

        if (popup.lastData === data) {
          Ember.set(popup, 'lastData', undefined);
          return;
        }
      }

      if (data) {
        let geometry = data.feature.getGeometry();
        let latlng = featureCenter(data.feature);

        if (geometry.getType() === 'Point') {
          popup.setOptions({
            pixelOffset: new google.maps.Size(0, -40)
          });
        } else {
          popup.setOptions({
            pixelOffset: new google.maps.Size(0, 0)
          });
        }

        popup.setPosition(latlng);
        popup.open(map);
        popup.lastData = data;
        Ember.set(data, 'editing', true);

        // see routable-site template for wormhole/infowindow layout
        if (wormhole && !wormhole.isDestroying && !wormhole.isDestroyed) {
          wormhole.rerender();
        }
      }
    },

    highlightResult(data) {
      var layer = this.get('activeLayer');
      var style;

      this.panToIfHidden(data.feature);

      if (data.type === 'marker') {
        style = {
          icon: {
            url: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
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

      if (!data.editingShape) {
        layer.data.revertStyle(data.feature);
      }

      if (!data.editing) {
        this.panBack();
      }
    }
  },

  resetAllLayers() {
    var layers = this.get('dataLayers');

    layers.forEach(layer => {
      layer.data.setDrawingMode(null);
    });
  },

  panToIfHidden(feature) {
    var panForOffscreen = this.get('panForOffscreen');

    if (!panForOffscreen) {
      return;
    }

    let map = this.get('map');
    let center = featureCenter(feature);
    let bounds = map.getBounds();

    if (!center) {
      return;
    }

    this.set('originalCenter', map.getCenter());

    if (!bounds.contains(center)) {
      map.panTo(center);
    }
  },

  panBack() {
    var panForOffscreen = this.get('panForOffscreen');

    if (!panForOffscreen) {
      return;
    }

    var map = this.get('map');
    var center = this.get('originalCenter');

    if (center) {
      map.setCenter(center);
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
      if (event.feature.getProperty('skip')) {
        return;
      }

      let drawingMode = this.get('drawingMode');
      let results = this.get('results');
      let found = results.find(function (item) {
        return item.feature.getId() === event.feature.getId();
      });

      event.feature.setProperty('mode', mode);
      event.feature.setProperty('type', drawingMode);
      event.feature.setProperty('isVisible', true);

      if (!found) {
        let item = {
          mode,
          layer,
          isVisible: true,
          type: drawingMode,
          feature: event.feature
        };

        results.pushObject(item);

        if (this.get('afterAddFeature')) {
          this.sendAction('afterAddFeature', item);
        }
      }

      let autoResetToPan = this.get('autoResetToPan');

      if (autoResetToPan) {
        this.send('changeDrawingMode', DRAWING_MODE.pan.id);
      }
    }));

    var clickListener = layer.data.addListener('click', event => {
      let results = this.get('results');
      let found = results.find(function (item) {
        return item.feature.getId() === event.feature.getId();
      });

      if (found.listItem) {
        found.listItem.send('edit');
      }
    });

    this.get('listeners').pushObjects([
      listener,
      clickListener
    ]);
  }),

  setup: on('didInsertElement', function () {
    var dm = this.get('dm');
    var results = this.get('results');
    var layers = this.get('dataLayers');
    var map = this.get('map');

    if (!this.get('mode')) {
      this.set('mode', MODE.draw.id);
    }

    // Enable all layers to show on map
    layers.forEach(layer => layer.data.setMap(map));

    let listener = dm.addListener('overlaycomplete', run.bind(this, (event) => {
      var activeLayer = this.get('activeLayer');
      var feature = overlayToFeature(event.type, event.overlay, results);

      event.overlay.setMap(null);

      activeLayer.data.add(feature);
    }));

    this.get('listeners').pushObject(listener);
  }),

  teardown: on('willDestroyElement', function () {
    var listeners = this.get('listeners');

    this.send('changeDrawingMode', DRAWING_MODE.pan.id);

    // Cleanup all listeners
    if (listeners) {
      listeners.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
    }
  })
});
