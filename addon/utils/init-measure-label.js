import MapLabel from './map-label';
import featureCenter from './feature-center';
import getMeasurement from './get-measurement';

export default function initMeasureLabel(result, map) {
  if (!result) {
    return;
  }

  if (result.mode === 'measure' && !result.label) {
    let center = featureCenter(result.feature);
    let measurement = getMeasurement(result.type, result.feature, result.distanceUnit);

    result.label = new MapLabel(center);
    result.label.label = `${measurement.value} ${measurement.unit}`;

    if (map) {
      result.label.setMap(map);
    }
  }
}
