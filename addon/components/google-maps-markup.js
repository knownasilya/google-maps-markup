import { inject as service } from '@ember/service';
import { tracked, cached } from '@glimmer/tracking';
import { copy } from 'ember-copy';
import { run, next } from '@ember/runloop';
import { A as boundArray } from '@ember/array';
import { set, action } from '@ember/object';
import { v1 } from 'uuid';
import { Root } from 'ember-composability-tools';
import overlayToFeature from '../utils/overlay-to-feature';
import featureCenter from '../utils/feature-center';
import initMeasureLabel from '../utils/init-measure-label';
import mapLabelFactory from '../utils/map-label';
import dynamicLabelFactory from '../utils/dynamic-label';
import labelPlotter from '../utils/label-plotter';

const clearAllConfirm =
  'Markup is unsaved. Do you wish to continue clearing all markup?';

export default class GoogleMapsMarkup extends Root {
  @service('markupData') markupData;

  // Start Attrs
  @cached
  get editable() {
    return this.args.editable ?? true;
  }

  @cached
  get panForOffscreen() {
    return this.args.panForOffscreen ?? true;
  }

  @cached
  get autoResetToPan() {
    return this.args.autoResetToPan ?? false;
  }

  @cached
  get map() {
    let map = this.args.map || this.markupData.map;

    return map;
  }

  get childComponents() {
    return [...this.children];
  }
  // End Attrs

  get results() {
    return this.markupData.results;
  }

  get textGeoJson() {
    return this.markupData.textGeoJson;
  }

  get tools() {
    return this.markupData.tools;
  }

  get layer() {
    return this.markupData.layer;
  }

  @tracked drawFinished;
  @tracked toolActive;
  @tracked activeTool = undefined;
  @tracked toolId = undefined;

  listeners = boundArray();
  toolListeners = boundArray();
  currentPoints = boundArray();
  resultsHidden = false;

  constructor() {
    super(...arguments);

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
  }

  @action
  setup(_el, [map]) {
    if (!this.mapSetup && map) {
      this.mapSetup = true;
      this.setupLayer();
      this.activateLayer(map);
    }
  }

  initPopupEvents() {
    let editable = this.editable;

    if (editable) {
      let popup = new google.maps.InfoWindow();

      popup.setContent(`<div id='google-maps-markup-infowindow'></div>`);

      popup.addListener('closeclick', () => {
        set(popup, 'lastData.editing', false);
        set(popup, 'lastData', undefined);
        // cleanup?
      });

      this.markupEditPopup = popup;
    }
  }

  addTextLabel(tool, position) {
    let autoResetToPan = this.autoResetToPan;
    let results = this.results;
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

            this.changeTool(this.tools.pan.id);
          },
          250
        );
      });
    }

    this.drawFinished = true;
  }

  createFeature(result, geometry) {
    let id = v1();
    let properties = {
      name: result.name,
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
  }

  enableFreeFormPolygon() {
    let autoResetToPan = this.autoResetToPan;
    let toolId = this.toolId;
    let map = this.map;
    let layer = this.layer;
    let tool = this.markupData.getTool(toolId);
    let style = copy(tool.style || {});
    let poly = new google.maps.Polyline({
      map,
      clickable: false,
    });

    this.toolActive = true;
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
      layer.data.add(feature);
      layer.data.overrideStyle(feature, style);

      if (autoResetToPan) {
        run.later(
          this,
          function () {
            this.changeTool(this.tools.pan.id);
          },
          250
        );
      }

      this.drawFinished = true;

      run.later(
        this,
        () => {
          this.toolActive = false;
        },
        250
      );
    });
  }

  @action
  updateOptionValue(tool, prop, value) {
    set(tool, prop, value);
  }

  @action
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
  }

  @action
  changeTool(toolId) {
    let markupDataService = this.markupData;
    let layer = this.layer;
    let map = this.map;
    let dm = this.dm;
    let tool = this.markupData.getTool(toolId);
    let listeners = this.toolListeners;

    this.activeTool = tool;
    this.drawFinished = false;
    markupDataService.set('activeTool', tool.id);

    this.resetLayer();
    this.clearListeners();
    dm.setDrawingMode(null);
    map.setOptions({ draggableCursor: 'default' });

    if (layer) {
      layer.data.setDrawingMode(null);

      if (tool.id === 'pan') {
        let clickListener = layer.data.addListener('click', (event) => {
          let found = this.childComponents.find(function (comp) {
            return comp.args.data?.feature.getId() === event.feature.getId();
          });

          if (found) {
            // invoke action on the component
            found.send('edit', event.latLng);
          }
        });
        let mouseoverListener = layer.data.addListener('mouseover', (event) => {
          let found = this.childComponents.find(function (comp) {
            return comp.args.data?.feature.getId() === event.feature.getId();
          });

          if (found) {
            // invoke action here
            this.highlightResult(found.args.data);
          }
        });
        let mouseoutListener = layer.data.addListener('mouseout', () => {
          this.childComponents.forEach((comp) => {
            this.resetResultStyle(comp.args.data);
          });
        });

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

        let dataListener = this.layer.data.addListener('click', (event) => {
          this.addTextLabel(tool, event.latLng);
          map.setOptions({ draggableCursor: 'default' });
          event.stop();
        });
        listeners.pushObject(dataListener);
      } else if (tool.dataId) {
        let style = copy(tool.style || {});

        map.setOptions({ draggableCursor: 'crosshair' });
        layer.data.setDrawingMode(tool.dataId);
        layer.data.setStyle(style);
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

    this.toolId = toolId;
  }

  @action
  toggleResults() {
    let isHidden = !this.resultsHidden;
    let results = this.results;

    results.forEach((result) => this.toggleResult(result, isHidden));
    this.layer.isHidden = isHidden;
    this.resultsHidden = isHidden;
  }

  @action
  clearResults() {
    if (confirm(clearAllConfirm)) {
      let layer = this.layer;
      let results = this.results;
      let textGeoJson = this.textGeoJson;

      layer.data.forEach((feature) => {
        layer.data.remove(feature);
      });

      results.forEach((result) => {
        if (result.showMeasurement) {
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
  }

  @action
  removeResult(result) {
    let results = this.results;
    let layer = this.layer;
    let textGeoJson = this.textGeoJson;

    if (result.type === 'text') {
      result.feature.setMap(null);
      textGeoJson.removeObject(result.geojson);
    } else {
      layer.data.remove(result.feature);
    }

    if (result.showMeasurement) {
      result.label.onRemove();
    }

    results.removeObject(result);
  }

  /**
   * Toggle show/hide of a result.
   *
   * @param {Object} result The result object to toggle.
   * @param {Boolean} force Override the toggle, true for show and false for hide.
   */
  @action
  toggleResult(result, force) {
    let layer = this.layer;
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

        if (result.showMeasurement) {
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

        if (result.showMeasurement) {
          result.label.show();
        }
      }
    }
  }

  @action
  editResult(data, guid) {
    let popup = this.markupEditPopup;
    let map = this.map;
    let editable = this.editable;
    let childComponents = this.childComponents;

    set(data, 'editing', true);

    // disable editing on other items
    childComponents.forEach((comp) => {
      if (comp.guid !== guid) {
        set(comp.args, 'data.editing', false);
      }
    });

    if (!editable) {
      return;
    }

    if (popup.getPosition()) {
      popup.close();

      if (popup.lastData) {
        set(popup, 'lastData.editing', false);
      }
    }

    if (data) {
      let latlng = featureCenter(data.feature);

      if (!latlng) {
        return;
      }

      popup.setOptions({
        pixelOffset: new google.maps.Size(0, 0),
      });
      popup.setPosition(latlng);
      popup.open(map);
      popup.lastData = data;
    }
  }

  @action
  highlightResult(data) {
    let layer = this.layer;
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
  }

  @action
  resetResultStyle(data) {
    let layer = this.layer;

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

  resetLayer() {
    this.layer.data.setDrawingMode(null);
  }

  clearListeners() {
    let listeners = this.toolListeners;

    listeners.forEach((l) => google.maps.event.removeListener(l));
    listeners.clear();
  }

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

    this.originalCenter = map.getCenter();

    if (!bounds.contains(center)) {
      map.panTo(center);
    }
  }

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
  }

  setupLayer() {
    let map = this.map;
    let toolId = this.toolId;
    let layer = this.layer;
    let tool = this.markupData.getTool(toolId);

    if (!layer.isHidden) {
      layer.data.setMap(map);
    }

    layer.data.setDrawingMode(tool && tool.dataId);

    let listener = layer.data.addListener('addfeature', (event) => {
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
        event.feature.setProperty('type', toolId);
        event.feature.setProperty('isVisible', true);
        event.feature.setProperty('style', style);
        event.feature.setProperty('fillColorTransparent', fillColorTransparent);
        event.feature.setProperty('distanceUnitId', tool.distanceUnitId);

        let item = {
          layer,
          style,
          fillColorTransparent,
          isVisible: true,
          type: toolId,
          name: tool.name,
          feature: event.feature,
          options: tool.options,
          showMeasurement: tool.showMeasurement,
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
              this.changeTool(this.tools.pan.id);
            },
            250
          );
        }

        this.drawFinished = true;
      }
    });

    this.listeners.pushObjects([listener]);
  }

  @action
  activateLayer(map) {
    let dm = this.dm;
    let results = this.results;

    // Enable layer to show on map
    this.markupData.layer.data.setMap(map);

    let listener = dm.addListener('overlaycomplete', (event) => {
      let feature = overlayToFeature(event.type, event.overlay, results);

      event.overlay.setMap(null);

      this.layer.data.add(feature);
    });

    this.listeners.pushObject(listener);

    if (!this.mapEventsSetup) {
      this.setupMapEvents(map);
    }
  }

  setupMapEvents(map) {
    let currentPoints = this.currentPoints;
    let currentLabel = this.currentLabel;

    if (map) {
      this.mapEventsSetup = true;

      let body = document.body;
      let plotter;

      let onClick = run.bind(this, (event) => {
        let toolId = this.toolId;
        let toolActive = this.toolActive;
        let tool = this.markupData.getTool(toolId);
        let mapDiv = map.getDiv();
        let target = event.target;
        let withinMap = mapDiv.contains(target);
        let results = this.results;
        let data = results.lastObject;

        // Set distanceUnitId if not set yet and available
        if (data && withinMap && !data.distanceUnitId && tool.distanceUnitId) {
          data.distanceUnitId = tool.distanceUnitId;
        }

        if (toolId === 'freeFormPolygon' && withinMap && toolActive !== true) {
          next(() => {
            this.enableFreeFormPolygon();
          });
          return;
        }

        if (toolActive === false) {
          this.toolActive = undefined;
          return;
        }

        let toolIsPan = toolId === 'pan';
        let drawFinished = this.drawFinished;
        let noPoints = !currentPoints.length;

        if (toolIsPan || (noPoints && drawFinished)) {
          return;
        }

        if (tool.showMeasurement && withinMap && noPoints && !drawFinished) {
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
      body.addEventListener('click', onClick);
      body.addEventListener('dblclick', onDblClick);
      body.addEventListener('mousemove', onMouseMove);

      this.bodyListeners = [
        { event: 'click', handler: onClick },
        { event: 'dblclick', handler: onDblClick },
        { event: 'mousemove', handler: onMouseMove },
      ];
    }
  }

  @action
  beforeRemove() {
    let listeners = this.listeners;
    let bodyListeners = this.bodyListeners;

    this.changeTool(this.tools.pan.id);

    // Cleanup all listeners
    if (listeners) {
      listeners.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
    }

    if (bodyListeners) {
      let body = document.body;

      bodyListeners.forEach((listener) => {
        body.removeEventListener(listener.event, listener.handler);
      });
    }
  }
}

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
  let mapEl = map.getDiv();
  let projection = map.getProjection();
  let bounds = map.getBounds();
  let ne = bounds.getNorthEast();
  let sw = bounds.getSouthWest();
  let topRight = projection.fromLatLngToPoint(ne);
  let bottomLeft = projection.fromLatLngToPoint(sw);
  let mapPosition = getOffset(mapEl);
  let pos = calculatePosition(mapPosition, event);
  let scale = 1 << map.getZoom();
  let point = new google.maps.Point(
    pos.x / scale + bottomLeft.x,
    pos.y / scale + topRight.y
  );
  let latlng = projection.fromPointToLatLng(point);

  return latlng;
}

function getOffset(element) {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  let rect = element.getBoundingClientRect();
  let win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}
