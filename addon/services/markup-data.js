import Service from '@ember/service';
import EmberObject, { action, computed, get } from '@ember/object';
import { A as boundArray } from '@ember/array';
import createFeature from '../utils/create-feature';
import initMeasureLabel from '../utils/init-measure-label';
import initTextLabel from '../utils/init-text-label';
import MODE from '../utils/modes';
import TOOLS from '../utils/tools';
import Layer from '../utils/layer';

const MODES = [MODE.draw.id, MODE.measure.id];

export default class MarkupData extends Service {
  mode = MODE.draw.id;
  markupResults = EmberObject.create({
    draw: boundArray(),
    measure: boundArray(),
  });
  textGeoJson = boundArray();
  modes = [MODE.draw, MODE.measure];
  drawTools = boundArray([
    TOOLS.pan,
    TOOLS.text,
    TOOLS.marker,
    TOOLS.polyline,
    TOOLS.circle,
    TOOLS.rectangle,
    TOOLS.polygon,
    TOOLS.freeFormPolygon,
  ]);
  measureTools = boundArray([
    TOOLS.pan,
    TOOLS.polyline,
    TOOLS.circle,
    TOOLS.rectangle,
    TOOLS.polygon,
  ]);

  activate(map) {
    this.set('map', map);

    let layers = this.layers;
    let measureResults = this.get('markupResults.measure');

    // Enable all layers to show on map
    layers.forEach((layer) => {
      layer.data.setMap(map);
    });

    // Init measure labels
    measureResults.forEach((result) => {
      if (result.label) {
        result.label.setMap(map);
      } else {
        initMeasureLabel(result, map);
      }
    });
  }

  changeModeByResults() {
    let markupResults = this.markupResults;

    for (let i = 0; i < MODES.length; i++) {
      let key = MODES[i];
      let modeResults = get(markupResults, key);

      if (modeResults && modeResults.length) {
        this.set('mode', key);
        return;
      }
    }
  }

  get layers() {
    if (this._cachedLayers) {
      return this._cachedLayers;
    }
    let results = this.results;
    let textGeoJson = this.textGeoJson;
    let setId = function (geom) {
      return createFeature(geom, results);
    };

    let items = [
      new Layer({
        textGeoJson,
        isHidden: false,
        data: new google.maps.Data({ featureFactory: setId }),
      }),
      new Layer({
        isHidden: false,
        data: new google.maps.Data({ featureFactory: setId }),
      }),
    ];

    this._cachedLayers = items;

    return items;
  }

  @computed('mode')
  get results() {
    let mode = this.mode;

    if (!mode) {
      return undefined;
    }

    return this.get(`markupResults.${mode}`);
  }

  set results(data) {
    let mode = this.mode;

    if (!mode) {
      return;
    }

    this.set(`markupResults.${mode}`, data);

    return data;
  }

  @action
  getTool(id, mode) {
    let toolIds = mode ? this.get(mode + 'Tools') : TOOLS;

    return Array.isArray(toolIds) ? toolIds.findBy('id', id) : toolIds[id];
  }

  @action
  featureToResult(feature, layer) {
    let map = this.map;
    let textGeoJson = this.textGeoJson;
    let name = feature.getProperty('name');
    let mode = feature.getProperty('mode');
    let style = feature.getProperty('style');
    let type = feature.getProperty('type');
    let results = this.get(`markupResults.${mode}`);
    let tool = this.getTool(type, mode);
    let result = {
      mode,
      layer,
      style,
      fillColorTransparent: feature.getProperty('fillColorTransparent'),
      isVisible: feature.getProperty('isVisible'),
      type,
      name,
      feature,
      options: tool?.options,
      distanceUnitId: feature.getProperty('distanceUnitId'),
      isEditable: Object.keys(style).length ? true : false,
    };

    if (result.style) {
      layer.data.overrideStyle(feature, result.style);
    }

    initMeasureLabel(result, map);
    initTextLabel(result, layer, map);

    // Put text into temp geojson table for export
    if (textGeoJson && result.type === 'text') {
      feature.toGeoJson((data) => {
        result.geojson = data;
        textGeoJson.pushObject(data);
      });
    }

    results.pushObject(result);
  }
}
