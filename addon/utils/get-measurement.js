import { polygonArea, circleArea, rectangleArea } from './shape-area';
import pathDistance from './path-distance';
import measureTypeResult from './measure-type-result';

export default function getMeasurement(type, feature, distanceUnitId) {
  switch (type) {
    case 'polyline': {
      let geometry = feature.getGeometry();
      let paths = geometry.getArray();
      let distance = pathDistance(paths);

      return measureTypeResult(type, distance, distanceUnitId);
    }

    case 'polygon': {
      let area = polygonArea(feature);
      return measureTypeResult(type, area, distanceUnitId);
    }

    case 'circle': {
      let area = circleArea(feature);
      return measureTypeResult(type, area, distanceUnitId);
    }

    case 'rectangle': {
      let area = rectangleArea(feature);
      return measureTypeResult(type, area, distanceUnitId);
    }
  }
}
