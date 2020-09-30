import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import $ from 'jquery';
import { copy } from 'ember-copy';
import Component from '@ember/component';
import { run, next } from '@ember/runloop';
import { A as boundArray } from '@ember/array';
import { set } from '@ember/object';
import { v1 } from 'ember-uuid';
import { ParentMixin } from 'ember-composability-tools';
import layout from './template';
import MODE from '../../utils/modes';
import overlayToFeature from '../../utils/overlay-to-feature';
import featureCenter from '../../utils/feature-center';
import initMeasureLabel from '../../utils/init-measure-label';
import mapLabelFactory from '../../utils/map-label';
import dynamicLabelFactory from '../../utils/dynamic-label';
import labelPlotter from '../../utils/label-plotter';

const clearAllConfirm =
  'Markup is unsaved. Do you wish to continue clearing all markup?';

export default Component.extend(ParentMixin, {
  // Start Attrs
  editable: true,
  panForOffscreen: true,
  autoResetToPan: false,
  map: alias('markupData.map'),
  // End Attrs

  layout: layout,
  markupData: service(),
  classNames: ['google-maps-markup'],
  dataLayers: alias('markupData.layers'),
  results: alias('markupData.results'),
  mode: alias('markupData.mode'),
  modes: alias('markupData.modes'),
  drawTools: alias('markupData.drawTools'),
  measureTools: alias('markupData.measureTools'),
  textGeoJson: alias('markupData.textGeoJson'),
  tools: alias('markupData.tools'),
  listeners: boundArray(),
  toolListeners: boundArray(),
  currentPoints: boundArray(),
  resultsHidden: false,
  activeLayer: undefined,
  toolId: undefined,
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects

  init() {
    this._super(...arguments);

    if (!window.google) {
      throw new Error('Sorry, but `window.google` is required for this addon');
    }
    this.toolId = this.tools.pan.id;
    this.dm = new google.maps.drawing.DrawingManager({
      drawingControl: false,
    });
    this.MapLabel = mapLabelFactory();
    this.currentLabel = new this.MapLabel(undefined, {
      dontScale: true,
    });
    this.DynamicLabel = dynamicLabelFactory();

    this.initPopupEvents();
  },

  initPopupEvents() {
    let editable = this.editable;

    if (editable) {
      let popup = new google.maps.InfoWindow();

      popup.setContent(`<div id='google-maps-markup-infowindow'></div>`);

      popup.addListener(
        'closeclick',
        run.bind(this, function () {
          set(popup, 'lastData.editing', false);
          set(popup, 'lastData', undefined);
          // cleanup?
        })
      );

      this.set('markupEditPopup', popup);
    }
  },

  addTextLabel(tool, position) {
    let autoResetToPan = this.autoResetToPan;
    let results = this.results;
    let mode = this.mode;
    let map = this.map;
    let style = copy(tool.style || {});
    let labelMarker = new this.DynamicLabel(position, {
      color: style.color,
      autoFocus: true,
      fontSize: style.fontSize,
      onOver() {
        console.log('over');
        labelMarker.highlight();
      },
      onOut() {
        console.log('out');
        labelMarker.clearHighlight();
      },
    });
    let item = {
      mode,
      style,
      isVisible: true,
      type: tool.id,
      feature: labelMarker,
      name: tool.name,
      options: tool.options,
      isEditable: Object.keys(style).length ? true : false,
    };

    labelMarker.setMap(map);
    results.insertAt(0, item);
    map.setOptions({ draggableCursor: undefined });
    // TODO: convert to geojson and add to active layer
    // later load during results process
    let feature = this.createFeature(item, labelMarker.position);
    let textGeoJson = this.textGeoJson;

    feature.toGeoJson((data) => {
      item.geojson = data;
      textGeoJson.pushObject(data);
    });

    if (this.afterAddFeature) {
      this.afterAddFeature(item);
    }

    if (autoResetToPan) {
      this.toolNotFinished = true;
      google.maps.event.addListenerOnce(labelMarker, 'focusout', () => {
        run.later(
          this,
          function () {
            let freshTool = this.markupData.getTool(tool.id);
            let freshStyle = copy(freshTool.style);

            labelMarker.color = freshStyle.color;
            set(item, 'style', freshStyle);
            set(item, 'geojson.properties.style', freshStyle);
            this.toolNotFinished = false;

            this.send('changeTool', this.tools.pan.id);
          },
          250
        );
      });
    }

    this.set('drawFinished', true);
  },

  createFeature(result, geometry) {
    let id = v1();
    let properties = {
      name: result.name,
      mode: result.mode,
      type: result.type,
      style: result.style,
      isVisible: true,
    };
    let feature = new google.maps.Data.Feature({
      geometry,
      properties,
      id,
    });

    return feature;
  },

  enableFreeFormPolygon() {
    let autoResetToPan = this.autoResetToPan;
    let toolId = this.toolId;
    let map = this.map;
    let mode = this.mode;
    let activeLayer = this.activeLayer;
    let tool = this.markupData.getTool(toolId);
    let style = copy(tool.style || {});
    let poly = new google.maps.Polyline({
      map,
      clickable: false,
    });

    this.set('toolActive', true);
    poly.setOptions(style);

    let move = google.maps.event.addListener(map, 'mousemove', (e) => {
      poly.getPath().push(e.latLng);
      map.setOptions({ draggable: false });
    });

    google.maps.event.addListenerOnce(map, 'click', () => {
      google.maps.event.removeListener(move);
      map.setOptions({ draggable: true });
      poly.setMap(null);

      let path = poly.getPath();
      let polygon = new google.maps.Data.Polygon([path.getArray()]);
      let item = {
        mode,
        style,
        isVisible: true,
        type: tool.id,
        name: tool.name,
      };
      let feature = this.createFeature(item, polygon);

      if (this.afterAddFeature) {
        this.afterAddFeature(item);
      }

      poly = null;
      activeLayer.data.add(feature);
      activeLayer.data.overrideStyle(feature, style);

      if (autoResetToPan) {
        run.later(
          this,
          function () {
            this.send('changeTool', this.tools.pan.id);
          },
          250
        );
      }

      this.set('drawFinished', true);

      run.later(
        this,
        () => {
          this.set('toolActive', false);
        },
        250
      );
    });
  },

  actions: {
    updateOptionValue(tool, prop, value) {
      set(tool, prop, value);
    },

    changeMode(mode) {
      this.set('mode', mode.id);
      this.changeLayer();
      this.send('changeTool', this.toolId);
    },

    fillColorTransparent() {
      set(
        this.activeTool,
        'fillColorTransparent',
        !this.activeTool.fillColorTransparent
      );

      if (this.activeTool.fillColorTransparent) {
        set(this.activeTool, 'style.fillOpacity', 0.5);
      } else {
        set(this.activeTool, 'style.fillOpacity', 0);
      }
    },

    changeTool(toolId) {
      let markupDataService = this.markupData;
      let activeLayer = this.activeLayer;
      let map = this.map;
      let dm = this.dm;
      let tool = this.markupData.getTool(toolId);
      let listeners = this.toolListeners;

      this.set('activeTool', tool);
      this.set('drawFinished', false);
      markupDataService.set('activeTool', tool.id);

      this.resetAllLayers();
      this.clearListeners();
      dm.setDrawingMode(null);
      map.setOptions({ draggableCursor: 'default' });

      if (activeLayer) {
        activeLayer.data.setDrawingMode(null);

        if (tool.id === 'pan') {
          let clickListener = activeLayer.data.addListener('click', (event) => {
            let childComponents = this.childComponents;
            let found = childComponents.find(function (comp) {
              return comp.get('data').feature.getId() === event.feature.getId();
            });

            if (found) {
              // invoke action on the component
              found.send('edit', event.latLng);
            }
          });
          let mouseoverListener = activeLayer.data.addListener(
            'mouseover',
            (event) => {
              let childComponents = this.childComponents;
              let found = childComponents.find(function (comp) {
                return (
                  comp.get('data').feature.getId() === event.feature.getId()
                );
              });

              if (found) {
                // invoke action here
                this.send('highlightResult', found.get('data'));
              }
            }
          );
          let mouseoutListener = activeLayer.data.addListener(
            'mouseout',
            () => {
              let childComponents = this.childComponents;

              childComponents.forEach((comp) => {
                this.send('resetResultStyle', comp.get('data'));
              });
            }
          );

          listeners.pushObjects([
            clickListener,
            mouseoverListener,
            mouseoutListener,
          ]);
        } else if (tool.id === 'text') {
          map.setOptions({ draggableCursor: 'crosshair' });

          let mapListener = map.addListener('click', (event) => {
            if (this.toolNotFinished) {
              return;
            }
            this.addTextLabel(tool, event.latLng);
            map.setOptions({ draggableCursor: 'default' });
            event.stop();
          });
          listeners.pushObject(mapListener);

          this.dataLayers.forEach((layer) => {
            let dataListener = layer.data.addListener('click', (event) => {
              this.addTextLabel(tool, event.latLng);
              map.setOptions({ draggableCursor: 'default' });
              event.stop();
            });
            listeners.pushObject(dataListener);
          });
        } else if (tool.dataId) {
          let style = copy(tool.style || {});

          map.setOptions({ draggableCursor: 'crosshair' });
          activeLayer.data.setDrawingMode(tool.dataId);
          activeLayer.data.setStyle(style);
        } else if (tool.dmId) {
          let style = copy(tool.style || {});

          map.setOptions({ draggableCursor: 'crosshair' });
          dm.setDrawingMode(tool.dmId);
          dm.setOptions({
            [`${tool.id}Options`]: style,
          });
          dm.setMap(map);
        } else {
          // for freeform polygon and others
          map.setOptions({ draggableCursor: 'crosshair' });
        }
      }

      this.set('toolId', toolId);
    },

    toggleResults() {
      let isHidden = this.toggleProperty('resultsHidden');
      let activeLayer = this.activeLayer;
      let results = this.results;

      results.forEach((result) => this.send('toggleResult', result, !isHidden));
      activeLayer.isHidden = isHidden;
    },

    clearResults() {
      if (confirm(clearAllConfirm)) {
        let mode = this.mode;
        let layer = this.activeLayer;
        let results = this.results;
        let textGeoJson = this.textGeoJson;

        layer.data.forEach((feature) => {
          layer.data.remove(feature);
        });

        results.forEach((result) => {
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

        if (this.afterClearResults) {
          this.afterClearResults(layer);
        }
      }
    },

    removeResult(result) {
      let mode = this.mode;
      let results = this.results;
      let layer = this.activeLayer;
      let textGeoJson = this.textGeoJson;

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
      let layer = this.activeLayer;
      let mode = this.mode;
      let isMeasure = mode === 'measure';
      let hide =
        force !== undefined && force !== null
          ? !force
          : result.type === 'text'
          ? result.feature.visible
          : layer.data.contains(result.feature);

      if (hide) {
        set(result, 'isVisible', false);

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
        set(result, 'isVisible', true);

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

    editResult(data, wormhole, position, elementId) {
      let popup = this.markupEditPopup;
      let map = this.map;
      let editable = this.editable;
      let childComponents = this.childComponents;

      set(data, 'editing', true);

      // disable editing on other items
      childComponents.forEach((comp) => {
        if (comp.elementId !== elementId) {
          set(comp, 'data.editing', false);
        }
      });

      if (!editable || !position) {
        return;
      }

      if (popup.getPosition()) {
        popup.close();

        if (popup.lastData) {
          set(popup, 'lastData.editing', false);
        }
      }

      if (data) {
        let geometry = data.feature.getGeometry
          ? data.feature.getGeometry()
          : data.feature.position;
        let latlng =
          position && position instanceof google.maps.LatLng
            ? position
            : featureCenter(data.feature);

        if (geometry.getType && geometry.getType() === 'Point') {
          popup.setOptions({
            pixelOffset: new google.maps.Size(0, -40),
          });
        } else {
          popup.setOptions({
            pixelOffset: new google.maps.Size(0, 0),
          });
        }

        popup.setPosition(latlng);
        popup.open(map);
        popup.lastData = data;

        // see routable-site template for wormhole/infowindow layout
        if (wormhole && !wormhole.isDestroying && !wormhole.isDestroyed) {
          wormhole.rerender();
        }
      }
    },

    highlightResult(data) {
      let layer = this.activeLayer;
      let style;

      this.panToIfHidden(data.feature);

      if (data.type === 'marker') {
        style = {
          icon: {
            url: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
            scaledSize: new google.maps.Size(22, 40),
          },
        };
      } else if (data.type === 'text') {
        data.feature.highlight();
      } else {
        style = {
          strokeColor: 'red',
          zIndex: 99999,
        };
      }

      if (data.label) {
        data.label.highlight();
      }

      layer.data.overrideStyle(data.feature, style);
    },

    resetResultStyle(data) {
      let layer = this.activeLayer;

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
    },
  },

  resetAllLayers() {
    let layers = this.dataLayers;

    layers.forEach((layer) => {
      layer.data.setDrawingMode(null);
    });
  },

  clearListeners() {
    let listeners = this.toolListeners;

    listeners.forEach((l) => google.maps.event.removeListener(l));
    listeners.clear();
  },

  panToIfHidden(feature) {
    let panForOffscreen = this.panForOffscreen;

    if (!panForOffscreen) {
      return;
    }

    let map = this.map;
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
    let panForOffscreen = this.panForOffscreen;

    if (!panForOffscreen) {
      return;
    }

    let map = this.map;
    let center = this.originalCenter;

    if (center) {
      map.setCenter(center);
    }
  },

  changeLayer() {
    let modeId = this.mode;
    let map = this.map;
    let toolId = this.toolId;
    let dataLayers = this.dataLayers;
    let activeLayer = this.activeLayer;

    this.set('lastActiveLayer', activeLayer);

    if (modeId === MODE.draw.id || modeId === MODE.measure.id) {
      let tool = this.markupData.getTool(toolId, modeId);

      activeLayer = dataLayers[modeId === MODE.draw.id ? 0 : 1];

      if (!activeLayer.isHidden) {
        activeLayer.data.setMap(map);
      }

      // tool doesn't exist for this mode, revert to pan
      if (!tool) {
        this.send('changeTool', this.tools.pan.id);
      }

      activeLayer.data.setDrawingMode(tool && tool.dataId);

      this.set('activeLayer', activeLayer);
      this.setupActiveLayer();
    }
  },

  setupActiveLayer() {
    let mode = this.mode;
    let layer = this.activeLayer;
    let lastLayer = this.lastActiveLayer;

    if (!layer) {
      return;
    }

    if (lastLayer) {
      google.maps.event.clearListeners(lastLayer.data, 'addfeature');
    }

    let listener = layer.data.addListener(
      'addfeature',
      run.bind(this, (event) => {
        if (event.feature.getProperty('skip')) {
          return;
        }

        let map = this.map;
        let tool = this.activeTool;
        let toolId = this.toolId;
        let results = this.results;
        let found = results.find(function (item) {
          if (item.feature && item.feature.getId) {
            return item.feature.getId() === event.feature.getId();
          } else if (item.feature) {
            return item.feature === event.feature;
          }
        });

        if (!found) {
          let fillColorTransparent = copy(tool.fillColorTransparent);
          let style = copy(tool.style || {});

          event.feature.setProperty('name', tool.name);
          event.feature.setProperty('mode', mode);
          event.feature.setProperty('type', toolId);
          event.feature.setProperty('isVisible', true);
          event.feature.setProperty('style', style);
          event.feature.setProperty(
            'fillColorTransparent',
            fillColorTransparent
          );
          event.feature.setProperty('distanceUnitId', tool.distanceUnitId);

          let item = {
            mode,
            layer,
            style,
            fillColorTransparent,
            isVisible: true,
            type: toolId,
            name: tool.name,
            feature: event.feature,
            options: tool.options,
            distanceUnitId: tool.distanceUnitId,
            isEditable: Object.keys(style).length ? true : false,
          };

          if (item.style) {
            item.style.zIndex = 111;
            layer.data.overrideStyle(event.feature, item.style);
          }

          initMeasureLabel(item, map);
          results.insertAt(0, item);

          if (this.afterAddFeature) {
            this.afterAddFeature(item);
          }

          let autoResetToPan = this.autoResetToPan;

          if (autoResetToPan) {
            run.later(
              this,
              function () {
                this.send('changeTool', this.tools.pan.id);
              },
              250
            );
          }

          this.set('drawFinished', true);
        }
      })
    );

    this.listeners.pushObjects([listener]);
  },

  didInsertElement() {
    this._super(...arguments);

    let dm = this.dm;
    let results = this.results;
    let layers = this.dataLayers;
    let map = this.map;

    if (!this.mode) {
      this.set('mode', MODE.draw.id);
    }

    // Enable all layers to show on map
    layers.forEach((layer) => layer.data.setMap(map));

    let listener = dm.addListener(
      'overlaycomplete',
      run.bind(this, (event) => {
        let activeLayer = this.activeLayer;
        let feature = overlayToFeature(event.type, event.overlay, results);

        event.overlay.setMap(null);

        activeLayer.data.add(feature);
      })
    );

    this.listeners.pushObject(listener);

    if (!this.mapEventsSetup) {
      this.setupMapEvents();
    }
  },

  didReceiveAttrs() {
    if (!this.mapSetup && this.map) {
      this.mapSetup = true;
      this.changeLayer();
    }
    if (!this.mapEventsSetup) {
      this.setupMapEvents();
    }
  },

  setupMapEvents() {
    let map = this.map;
    let currentPoints = this.currentPoints;
    let currentLabel = this.currentLabel;

    if (map) {
      this.set('mapEventsSetup', true);

      let $body = $('body');
      let plotter;

      let onClick = run.bind(this, (event) => {
        let mode = this.mode;
        let toolId = this.toolId;
        let toolActive = this.toolActive;
        let tool = this.markupData.getTool(toolId, mode);
        let mapDiv = map.getDiv();
        let target = event.target;
        let withinMap = mapDiv.contains(target);
        let results = this.results;
        let data = results.get('lastObject');

        // Set distanceUnitId if not set yet and available
        if (data && withinMap && !data.distanceUnitId && tool.distanceUnitId) {
          data.distanceUnitId = tool.distanceUnitId;
        }

        if (mode === 'draw') {
          if (
            withinMap &&
            toolActive !== true &&
            toolId === 'freeFormPolygon'
          ) {
            next(() => {
              this.enableFreeFormPolygon();
            });
            return;
          }

          if (toolActive === false) {
            this.set('toolActive', undefined);
            return;
          }

          return;
        }

        let toolIsPan = toolId === 'pan';
        let drawFinished = this.drawFinished;
        let noPoints = !currentPoints.get('length');

        if (toolIsPan || (noPoints && drawFinished)) {
          return;
        }

        if (withinMap && noPoints && !drawFinished) {
          let latlng = calculateLatLng(map, event);
          currentPoints.push(latlng);
          plotter = labelPlotter(
            currentLabel,
            currentPoints,
            toolId,
            event,
            map,
            tool.distanceUnitId
          );
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
        { event: 'mousemove', handler: onMouseMove },
      ]);
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    let listeners = this.listeners;
    let bodyListeners = this.bodyListeners;

    this.send('changeTool', this.tools.pan.id);

    // Cleanup all listeners
    if (listeners) {
      listeners.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
    }

    if (bodyListeners) {
      let $body = $('body');

      bodyListeners.forEach((listener) => {
        $body.off(listener.event, listener.handler);
      });
    }
  },
});

function calculatePosition(mapPosition, event) {
  let mapLeft = mapPosition.left;
  let mapTop = mapPosition.top;
  let x = event.pageX;
  let y = event.pageY;

  return {
    x: x - mapLeft,
    y: y - mapTop,
  };
}

function calculateLatLng(map, event) {
  let $map = $(map.getDiv());
  let projection = map.getProjection();
  let bounds = map.getBounds();
  let ne = bounds.getNorthEast();
  let sw = bounds.getSouthWest();
  let topRight = projection.fromLatLngToPoint(ne);
  let bottomLeft = projection.fromLatLngToPoint(sw);
  let mapPosition = $map.offset();
  let pos = calculatePosition(mapPosition, event);
  let scale = 1 << map.getZoom();
  let point = new google.maps.Point(
    pos.x / scale + bottomLeft.x,
    pos.y / scale + topRight.y
  );
  let latlng = projection.fromPointToLatLng(point);

  return latlng;
}
