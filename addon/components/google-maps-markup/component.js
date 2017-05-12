import Ember from 'ember';
import { v1 } from 'ember-uuid';
import { ParentMixin } from 'ember-composability-tools';
import layout from './template';
import MODE from '../../utils/modes';
import TOOLS from '../../utils/tools';
import overlayToFeature from '../../utils/overlay-to-feature';
import featureCenter from '../../utils/feature-center';
import initMeasureLabel from '../../utils/init-measure-label';
import MapLabel from '../../utils/map-label';
import Marker from '../../utils/marker';
import DynamicLabel from '../../utils/dynamic-label';
import labelPlotter from '../../utils/label-plotter';
import hoverColor from '../../utils/hover-color';

if (!window.google) {
  throw new Error('Sorry, but `google` defined globally is required for this addon');
}

const {
  on,
  run,
  set,
  inject,
  computed,
  A: boundArray,
  observer: observes
} = Ember;
const clearAllConfirm = 'Clearing results will persist the changes, if you want to save a copy of the results please copy the url before clearing the markup.';

export default Ember.Component.extend(ParentMixin, {
  // Start Attrs
  editable: true,
  panForOffscreen: true,
  autoResetToPan: false,
  map: computed.alias('markupData.map'),
  // End Attrs

  layout: layout,
  markupData: inject.service(),
  classNames: ['google-maps-markup'],
  dataLayers: computed.alias('markupData.layers'),
  results: computed.alias('markupData.results'),
  mode: computed.alias('markupData.mode'),
  textGeoJson: computed.alias('markupData.textGeoJson'),
  dm: new google.maps.drawing.DrawingManager({
    drawingControl: false
  }),
  listeners: boundArray(),
  toolListeners: boundArray(),
  currentPoints: boundArray(),
  currentLabel: new MapLabel(undefined, {
    dontScale: true
  }),
  resultsHidden: false,
  activeLayer: undefined,
  toolId: TOOLS.pan.id,
  modes: [
    MODE.draw,
    MODE.measure
  ],
  drawingTools: boundArray([
    TOOLS.pan,
    TOOLS.text,
    TOOLS.marker,
    TOOLS.polyline,
    TOOLS.circle,
    TOOLS.rectangle,
    TOOLS.polygon,
    TOOLS.freeFormPolygon
  ]),
  measureTools: boundArray([
    TOOLS.pan,
    TOOLS.polyline,
    TOOLS.circle,
    TOOLS.rectangle,
    TOOLS.polygon
  ]),

  init() {
    this._super(...arguments);

    this.initPopupEvents();

    if (!this.get('mapEventsSetup')) {
      this.addObserver('map', this, 'setupMapEvents');
    }
  },

  initPopupEvents() {
    let editable = this.get('editable');

    if (editable) {
      let popup = new google.maps.InfoWindow();

      popup.setContent(`<div id='google-maps-markup-infowindow'></div>`);

      popup.addListener('closeclick', run.bind(this, function () {
        Ember.set(popup, 'lastData.editing', false);
        Ember.set(popup, 'lastData', undefined);
        // cleanup?
      }));

      this.set('markupEditPopup', popup);
    }
  },

  getTool(id, mode) {
    let toolIds = mode ? this.get((mode === 'draw' ? 'drawing' : mode) + 'Tools') : TOOLS;
    return Array.isArray(toolIds) ? toolIds.findBy('id', id) : toolIds[id];
  },

  addTextLabel(tool, position) {
    let autoResetToPan = this.get('autoResetToPan');
    let results = this.get('results');
    let mode = this.get('mode');
    let map = this.get('map');
    let style = Ember.copy(tool.style);
    let labelMarker = new DynamicLabel(position, {
      color: style.color,
      autoFocus: true
    });
    let item = {
      mode,
      style,
      isVisible: true,
      type: tool.id,
      name: tool.name,
      feature: labelMarker
    };

    labelMarker.setMap(map);
    results.pushObject(item);
    map.setOptions({ draggableCursor: undefined });
    // TODO: convert to geojson and add to active layer
    // later load during results process
    let feature = this.createFeature(item, labelMarker.position);
    let textGeoJson = this.get('textGeoJson');

    feature.toGeoJson(data => {
      item.geojson = data;
      textGeoJson.pushObject(data);
    });

    if (autoResetToPan) {
      this.toolNotFinished = true;
      google.maps.event.addListenerOnce(labelMarker, 'focusout', () => {
        run.later(this, function () {
          let freshTool = this.getTool(tool.id);
          let freshStyle = Ember.copy(freshTool.style);

          labelMarker.color = freshStyle.color;
          item.style = freshStyle;
          item.geojson.properties.style = freshStyle;
          this.toolNotFinished = false;

          this.send('changeTool', TOOLS.pan.id);
        }, 250);
      });
    }

    this.set('drawFinished', true);
  },

  createFeature(result, geometry) {
    let id = v1();
    let properties = {
      mode: result.mode,
      type: result.type,
      style: result.style,
      isVisible: true
    };
    let feature = new google.maps.Data.Feature({
      geometry,
      properties,
      id
    });

    return feature;
  },

  enableFreeFormPolygon() {
    let toolId = this.get('toolId');
    let map = this.get('map');
    let mode = this.get('mode');
    let activeLayer = this.get('activeLayer');
    let tool = this.getTool(toolId);
    let poly = new google.maps.Polyline({
      map: map,
      clickable: false
    });
    let move = google.maps.event.addListener(map, 'mousemove', (e) => {
      poly.getPath().push(e.latLng);
    });

    google.maps.event.addListenerOnce(map, 'mouseup', () => {
      google.maps.event.removeListener(move);
      poly.setMap(null);

      let path = poly.getPath();
      let polygon = new google.maps.Data.Polygon([path.getArray()]);
      let style = Ember.copy(tool.style);
      let item = {
        mode,
        style,
        isVisible: true,
        type: tool.id,
        name: tool.name
      };
      let feature = this.createFeature(item, polygon);

      activeLayer.data.add(feature);
      activeLayer.data.overrideStyle(feature, style);
      this.send('changeTool', TOOLS.pan.id);
    });
  },

  actions: {

    updateOptionValue(tool, prop, value) {
      set(tool, prop, value);
    },

    changeMode(mode) {
      this.set('mode', mode.id);
    },

    fillColorTransparent() {
      set(this.activeTool, 'fillColorTransparent', ! this.activeTool.fillColorTransparent)

      if (this.activeTool.fillColorTransparent) {
        set(this.activeTool, 'style.fillOpacity', 0.5);
      } else {
        set(this.activeTool, 'style.fillOpacity', 0);
      }
    },

    changeTool(toolId) {
      this.resetAllLayers();
      this.clearListeners();

      let markupDataService = this.get('markupData');
      let activeLayer = this.get('activeLayer');
      let map = this.get('map');
      let dm = this.get('dm');
      let tool = this.getTool(toolId);
      let listeners = this.get('toolListeners');

      this.set('activeTool', tool);
      this.set('drawFinished', false);
      markupDataService.set('activeTool', tool.id);

      if (activeLayer) {
        if (tool.id === 'pan') {
          activeLayer.data.setDrawingMode(null);
          dm.setDrawingMode(null);
          map.setOptions({ draggableCursor: 'default' });

          let clickListener = activeLayer.data.addListener('click', event => {
            let childComponents = this.get('childComponents');
            let found = childComponents.find(function (comp) {
              return comp.get('data').feature.getId() === event.feature.getId();
            });

            if (found) {
              // invoke action on the component
              found.send('edit', event.latLng);
            }
          });
          listeners.pushObject(clickListener);
        } else if (tool.id === 'text') {
          map.setOptions({ draggableCursor: 'crosshair' });
          let mapListener = map.addListener('click', event => {
            if (this.toolNotFinished) {
              return;
            }
            this.addTextLabel(tool, event.latLng);
            map.setOptions({ draggableCursor: 'default' });
            event.stop();
          });
          let dataListener = activeLayer.data.addListener('click', event => {
            this.addTextLabel(tool, event.latLng);
            map.setOptions({ draggableCursor: 'default' });
            event.stop();
          });
          listeners.pushObjects([ mapListener, dataListener ]);
        } else if (tool.dataId === 'Point') {
          activeLayer.data.setDrawingMode(tool.dataId);
        } else if (tool.dataId) {
          let style = Ember.copy(tool.style);

          activeLayer.data.setDrawingMode(tool.dataId);
          activeLayer.data.setStyle(style);
        } else if (tool.dmId) {
          let style = Ember.copy(tool.style);
          
          dm.setDrawingMode(tool.dmId);
          dm.setOptions({
            [`${tool.id}Options`]: style
          });
          dm.setMap(map);
        } else {
          map.setOptions({ draggableCursor: 'default' });
        }
      }

      this.set('toolId', toolId);
    },

    toggleResults() {
      let isHidden = this.toggleProperty('resultsHidden');
      let activeLayer = this.get('activeLayer');
      let results = this.get('results');

      results.forEach(result => this.send('toggleResult', result, !isHidden));
      activeLayer.isHidden = isHidden;
    },

    clearResults() {
      if (confirm(clearAllConfirm)) {
        let mode = this.get('mode');
        let layer = this.get('activeLayer');
        let results = this.get('results');
        let textGeoJson = this.get('textGeoJson');

        layer.data.forEach((feature) => {
          layer.data.remove(feature);
        });

        results.forEach(result => {
          if (mode === 'measure') {
            result.label.onRemove();
          } else if (result.feature.setMap) {
            // remove text marker
            result.feature.setMap(null);
            if (result.type === 'text') {
              textGeoJson.removeObject(result.geojson);
            }
          }
        });

        results.clear();

        if (this.get('afterClearResults')) {
          this.sendAction('afterClearResults', layer);
        }
      }
    },

    removeResult(result) {
      let mode = this.get('mode');
      let results = this.get('results');
      let layer = this.get('activeLayer');
      let textGeoJson = this.get('textGeoJson');

      if (result.type === 'text') {
        result.feature.setMap(null);
        textGeoJson.removeObject(result.geojson);
      } else {
        layer.data.remove(result.feature);
      }

      if (mode === 'measure') {
        result.label.onRemove();
      }

      results.removeObject(result);
    },

    /**
     * Toggle show/hide of a result.
     *
     * @param {Object} result The result object to toggle.
     * @param {Boolean} force Override the toggle, true for show and false for hide.
     */
    toggleResult(result, force) {
      let layer = this.get('activeLayer');
      let mode = this.get('mode');
      let isMeasure = mode === 'measure';
      let hide = force !== undefined && force !== null ?
        !force :
        result.type === 'text' ? result.feature.visible : layer.data.contains(result.feature);

      if (hide) {
        Ember.set(result, 'isVisible', false);

        if (result.type === 'text') {
          result.feature.hide();
        } else {
          result.feature.setProperty('isVisible', false);
          layer.data.remove(result.feature);

          if (isMeasure) {
            result.label.hide();
          }
        }
      } else {
        Ember.set(result, 'isVisible', true);

        if (result.type === 'text') {
          result.feature.show();
        } else {
          result.feature.setProperty('isVisible', true);
          layer.data.add(result.feature);

          if (isMeasure) {
            result.label.show();
          }
        }
      }
    },

    editResult(data, wormhole, position) {
      let popup = this.get('markupEditPopup');
      let map = this.get('map');
      let editable = this.get('editable');

      if (!editable) {
        return;
      }

      if (popup.getPosition()) {
        popup.close();

        if (popup.lastData) {
          Ember.set(popup, 'lastData.editing', false);
        }
      }

      if (data) {
        let geometry = data.feature.getGeometry ? data.feature.getGeometry() : data.feature.position;
        let latlng = position && position instanceof google.maps.LatLng ? position : featureCenter(data.feature);

        if (geometry.getType && geometry.getType() === 'Point') {
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
      let layer = this.get('activeLayer');
      let style;

      this.panToIfHidden(data.feature);

      if (data.type === 'marker') {
        style = {
          icon: {
            url: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
            scaledSize: new google.maps.Size(22, 40),
          }
        };

        if(data.hoverStyle){
          style = data.hoverStyle;
        }

      } else if (data.type === 'text') {
        data.feature.highlight();
      } else {
          style = {
            strokeColor: 'red',
            zIndex:99999
          };
      }

      if (data.label) {
        data.label.highlight();
      }

      layer.data.overrideStyle(data.feature, style);
    },

    resetResultStyle(data) {
      let layer = this.get('activeLayer');

      if (!data.editingShape) {
        if (data.type === 'text') {
          data.feature.clearHighlight();
        } else {
          layer.data.revertStyle(data.feature);
          if (data.style) {
            layer.data.overrideStyle(data.feature, data.style);
          }

          if (data.label) {
            data.label.clearHighlight();
          }
        }
      }

      if (!data.editing) {
        this.panBack();
      }
    }
  },

  resetAllLayers() {
    let layers = this.get('dataLayers');

    layers.forEach(layer => {
      layer.data.setDrawingMode(null);
    });
  },

  clearListeners() {
    let listeners = this.get('toolListeners');

    listeners.forEach(l => google.maps.event.removeListener(l));
    listeners.clear();
  },

  panToIfHidden(feature) {
    let panForOffscreen = this.get('panForOffscreen');

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
    let panForOffscreen = this.get('panForOffscreen');

    if (!panForOffscreen) {
      return;
    }

    let map = this.get('map');
    let center = this.get('originalCenter');

    if (center) {
      map.setCenter(center);
    }
  },

  changeLayer: on('init', observes('mode', 'map', function () {
    let modeId = this.get('mode');
    let map = this.get('map');
    let toolId = this.get('toolId');
    let dataLayers = this.get('dataLayers');
    let activeLayer = this.get('activeLayer');

    this.set('lastActiveLayer', activeLayer);

    if (modeId === MODE.draw.id || modeId === MODE.measure.id) {
      let tool = this.getTool(toolId, modeId);

      activeLayer = dataLayers[modeId === MODE.draw.id ? 0 : 1];

      if (!activeLayer.isHidden) {
        activeLayer.data.setMap(map);
      }

      // tool doesn't exist for this mode, revert to pan
      if (!tool) {
        this.send('changeTool', TOOLS.pan.id);
      }

      activeLayer.data.setDrawingMode(tool && tool.dataId);

      this.set('activeLayer', activeLayer);
    }
  })),

  activeLayerSetup: observes('activeLayer', function () {
    let mode = this.get('mode');
    let layer = this.get('activeLayer');
    let lastLayer = this.get('lastActiveLayer');

    if (!layer) {
      return;
    }

    if (lastLayer) {
      google.maps.event.clearListeners(lastLayer.data, 'addfeature');
    }

    let listener = layer.data.addListener('addfeature', run.bind(this, (event) => {
      if (event.feature.getProperty('skip')) {
        return;
      }

      let map = this.get('map');
      let tool = this.get('activeTool');
      let toolId = this.get('toolId');
      let results = this.get('results');
      let found = results.find(function (item) {
        if (item.feature && item.feature.getId) {
          return item.feature.getId() === event.feature.getId();
        } else if (item.feature) {
          return item.feature === event.feature;
        }
      });

      if (!found) {
        let style = Ember.copy(tool.style);
        event.feature.setProperty('mode', mode);
        event.feature.setProperty('type', toolId);
        event.feature.setProperty('isVisible', true);
        event.feature.setProperty('style', style);

        let item = {
          mode,
          layer,
          style,
          isVisible: true,
          type: toolId,
          name: tool.name,
          feature: event.feature
        };

        if (item.style) {
          layer.data.overrideStyle(event.feature, item.style);
        }

        initMeasureLabel(item, map);
        results.pushObject(item);

        if (this.get('afterAddFeature')) {
          this.sendAction('afterAddFeature', item);
        }

        let autoResetToPan = this.get('autoResetToPan');

        if (autoResetToPan) {
          run.later(this, function () {
            this.send('changeTool', TOOLS.pan.id);
          }, 250);
        }

        this.set('drawFinished', true);
      }
    }));

    this.get('listeners').pushObjects([
      listener
    ]);
  }),

  didInsertElement() {
    this._super(...arguments);

    let dm = this.get('dm');
    let results = this.get('results');
    let layers = this.get('dataLayers');
    let map = this.get('map');

    if (!this.get('mode')) {
      this.set('mode', MODE.draw.id);
    }

    // Enable all layers to show on map
    layers.forEach(layer => layer.data.setMap(map));

    let listener = dm.addListener('overlaycomplete', run.bind(this, (event) => {
      let activeLayer = this.get('activeLayer');
      let feature = overlayToFeature(event.type, event.overlay, results);

      event.overlay.setMap(null);

      activeLayer.data.add(feature);
    }));

    this.get('listeners').pushObject(listener);

    if (!this.get('mapEventsSetup')) {
      this.setupMapEvents();
    }
  },

  didReceiveAttrs() {
    if (!this.get('mapEventsSetup')) {
      this.setupMapEvents();
    }
  },

  setupMapEvents() {
    let map = this.get('map');
    let currentPoints = this.get('currentPoints');
    let currentLabel = this.get('currentLabel');

    if (map) {
      this.set('mapEventsSetup', true);

      let $body = Ember.$('body');
      let plotter;

      let onClick = run.bind(this, (event) => {
        let activeLayer = this.get('activeLayer');
        let toolId = this.get('toolId');
        let tool = this.getTool(toolId);
        let mode = this.get('mode');
        let mapDiv = map.getDiv();
        let target = event.target;
        let withinMap = mapDiv.contains(target);
        let results = this.get('results');

        if (mode === 'draw') {
          if (withinMap && toolId === 'freeFormPolygon') {
            this.enableFreeFormPolygon();
          } else if (withinMap && toolId === 'marker') {
            let length = results.get('length');
            let arrayIndexOffSet = 1;
            let lastObjectIndex = length - arrayIndexOffSet;
            let data = results.get('lastObject');

            let iconObj = tool.icons.find(function(iconObj){
              return iconObj.id === tool.icon.id;
            });

             let markerObj = tool.markers.find(function(markerObj){
              return markerObj.id === tool.marker.id;
            });

            if (markerObj.id !== 'default') {

              let style = {
                icon: {
                  path: markerObj.path,
                  fillColor: tool.style.color,
                  fillOpacity: 1,
                  strokeColor: '',
                  strokeWeight: 0,
                  scaledSize: new google.maps.Size(22, 40)
                },
                map_icon_label: '<i class="material-icons">' + markerObj.id + '</i>'
              };

              let hoverStyle = {
                icon: {
                  path: markerObj.path,
                  fillColor: hoverColor(tool.style.color),
                  fillOpacity: 1,
                  strokeColor: '',
                  strokeWeight: 0,
                  scaledSize: new google.maps.Size(22, 40)
                }
              };

              if (tool.icon.id !== 'default') {
                var marker = new Marker({
                  position: calculateLatLng(map, event),
                  map: map,
                  icon: {
                    path: markerObj.path,
                    fillColor: tool.style.color,
                    fillOpacity: 1,
                    strokeColor: '',
                    strokeWeight: 0,
                    scaledSize: new google.maps.Size(22, 40)
                  },
                  map_icon_label: '<i class="material-icons">' + iconObj.id + '</i>'
                })

                // To add the marker to the map, call setMap();
                marker.setMap(map);
              }

              data.hoverStyle = hoverStyle;
              data.style = style;
              results[lastObjectIndex] = data;
              activeLayer.data.overrideStyle(data.feature, style);
            }
          }

          return;
        }

        let toolIsPan = toolId === 'pan';
        let drawFinished = this.get('drawFinished');
        let noPoints = !currentPoints.get('length');

        if (toolIsPan || (noPoints && drawFinished)) {
          return;
        }

        if (withinMap && noPoints && !drawFinished) {
          let latlng = calculateLatLng(map, event);
          currentPoints.push(latlng);
          plotter = labelPlotter(currentLabel, currentPoints, toolId, event, map);
        } else if (withinMap && !toolIsPan && !drawFinished) {
          let latlng = calculateLatLng(map, event);
          currentPoints.push(latlng);
        } else if (plotter && drawFinished) {
          plotter.finish();
          plotter = undefined;
        }
      });

      let onDblClick = run.bind(this, (event) => {
        if (plotter) {
          plotter.finish();
          plotter = undefined;
        }
        event.stopPropagation();
        event.preventDefault();
      });

      let onMouseMove = run.bind(this, (event) => {
        if (plotter) {
          let latlng = calculateLatLng(map, event);
          plotter.update(currentPoints.concat(latlng));
        }
      });

      // Setup raw click handling - workaround for no basic events for drawing
      $body.on('click', onClick);
      $body.on('dblclick', onDblClick);
      $body.on('mousemove', onMouseMove);

      this.set('bodyListeners', [
        { event: 'click', handler: onClick },
        { event: 'dblclick', handler: onDblClick },
        { event: 'mousemove', handler: onMouseMove }
      ]);
    }
  },

  teardown: on('willDestroyElement', function () {
    let listeners = this.get('listeners');
    let bodyListeners = this.get('bodyListeners');

    this.send('changeTool', TOOLS.pan.id);

    // Cleanup all listeners
    if (listeners) {
      listeners.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
    }

    if (bodyListeners) {
      let $body = Ember.$('body');

      bodyListeners.forEach(listener => {
        $body.off(listener.event, listener.handler);
      });
    }
  })
});

function calculatePosition(mapPosition, event) {
  let mapLeft = mapPosition.left;
  let mapTop = mapPosition.top;
  let x = event.pageX;
  let y = event.pageY;

  return {
    x: x - mapLeft,
    y: y - mapTop
  };
}

function calculateLatLng(map, event) {
  let $map = Ember.$(map.getDiv());
  let projection = map.getProjection();
  let bounds = map.getBounds();
  let ne = bounds.getNorthEast();
  let sw = bounds.getSouthWest();
  let topRight = projection.fromLatLngToPoint(ne);
  let bottomLeft = projection.fromLatLngToPoint(sw);
  let mapPosition = $map.offset();
  let pos = calculatePosition(mapPosition, event);
  let scale = 1 << map.getZoom();
  let point = new google.maps.Point(pos.x / scale + bottomLeft.x, pos.y / scale + topRight.y);
  let latlng = projection.fromPointToLatLng(point);

  return latlng;
}
