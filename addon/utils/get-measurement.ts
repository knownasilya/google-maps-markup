import { polygonArea, circleArea, rectangleArea } from './shape-area';
import pathDistance from './path-distance';
import measureTypeResult, { OptionId } from './measure-type-result';

export default function getMeasurement(
  type: OptionId,
  feature: google.maps.Data.Feature,
  distanceUnitId: string
) {
  switch (type) {
    case 'polyline': {
      const geometry = feature.getGeometry();
      const paths = geometry.getArray();
      const distance = pathDistance(paths);

      return measureTypeResult(type, distance, distanceUnitId);
    }

    case 'polygon': {
      const area = polygonArea(feature);
      return measureTypeResult(type, area, distanceUnitId);
    }

    case 'circle': {
      const area = circleArea(feature);
      return measureTypeResult(type, area, distanceUnitId);
    }

    case 'rectangle': {
      const area = rectangleArea(feature);
      return measureTypeResult(type, area, distanceUnitId);
    }
  }
}
