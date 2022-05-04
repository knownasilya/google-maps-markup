import Service from '@ember/service';
import { action } from '@ember/object';
import { A as boundArray } from '@ember/array';
import createFeature from '../utils/create-feature';
import initMeasureLabel from '../utils/init-measure-label';
import initTextLabel from '../utils/init-text-label';
import getTools from '../utils/tools';
import Layer from '../utils/layer';
import { cached, tracked } from '@glimmer/tracking';

export default class MarkupData extends Service {
  results = boundArray();
  textGeoJson = boundArray();
  tools = getTools();

  @tracked map;

  constructor() {
    super(...arguments);
    let tools = this.tools;
    this.orderedTools = [
      tools.pan,
      tools.text,
      tools.marker,
      tools.polyline,
      tools.circle,
      tools.rectangle,
      tools.polygon,
      tools.freeFormPolygon,
    ];
  }

  activate(map) {
    this.map = map;

    // Enable layer to show on map
    this.layer.data.setMap(map);

    // Init measure labels
    this.results
      .filter((item) => item.showMeasurement)
      .forEach((result) => {
        if (result.label) {
          result.label.setMap(map);
        } else {
          initMeasureLabel(result, map);
        }
      });
  }

  @cached
  get layer() {
    let results = this.results;
    let textGeoJson = this.textGeoJson;
    let featureFactory = function (geom) {
      return createFeature(geom, results);
    };

    let layer = new Layer({
      textGeoJson,
      isHidden: false,
      featureFactory,
    });

    return layer;
  }

  @action
  getTool(id = this.tools.pan.id) {
    return this.tools[id];
  }

  @action
  featureToResult(feature, layer) {
    let map = this.map;
    let textGeoJson = this.textGeoJson;
    let name = feature.getProperty('name');
    let style = feature.getProperty('style');
    let type = feature.getProperty('type');
    let results = this.results;
    let tool = this.getTool(type);
    let result = {
      layer,
      style,
      type,
      name,
      feature,
      options: tool?.options,
      fillColorTransparent: feature.getProperty('fillColorTransparent'),
      isVisible: feature.getProperty('isVisible'),
      showMeasurement: feature.getProperty('showMeasurement'),
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
