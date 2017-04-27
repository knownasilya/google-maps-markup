import pathsToBounds from './paths-to-bounds';
import pathDistance from './path-distance';
import measureTypeResult from './measure-type-result';

const LatLng = google.maps.LatLng;
const {
  computeArea,
  computeDistanceBetween
} = google.maps.geometry.spherical;

export default function labelPlotter(label, points, type, event, map, distanceUnit) {
  if (type === 'circle') {
    label.position = points[0];
  }

  return {
    update(points) {
      switch(type) {
        case 'pan': return;

        case 'circle': {
          if (points.length === 2) {
            let radius = computeDistanceBetween(points[0], points[1]);
            let area = Math.PI * (radius * radius);
            let result = measureTypeResult(type, area, distanceUnit);
            label.label = `${result.value} ${result.unit}`;
            label.setMap(map);
          }
          break;
        }

        case 'polyline': {
          if (points.length >= 2) {
            let bounds = pathsToBounds(points);
            let distance = pathDistance(points);
            let result = measureTypeResult(type, distance, distanceUnit);
            label.label = `${result.value} ${result.unit}`;
            label.position = bounds.getCenter();
            label.setMap(map);
          }
          break;
        }

        case 'rectangle': {
          if (points.length === 2) {
            let calcPoints = [
              points[0],
              new LatLng(points[0].lat(), points[1].lng()),
              points[1],
              new LatLng(points[1].lat(), points[0].lng())
            ];
            let bounds = pathsToBounds(calcPoints);
            let area = computeArea(calcPoints);
            let result = measureTypeResult(type, area, distanceUnit);
            label.label = `${result.value} ${result.unit}`;
            label.position = bounds.getCenter();
            label.setMap(map);
          }
          break;
        }

        /*jshint -W086 */
        case 'polygon': {
          if (points.length < 3) {
            break;
          }
          // move on to default
        }

        default: {
          if (points.length > 1) {
            let bounds = pathsToBounds(points);
            let area = computeArea(points);
            let result = measureTypeResult(type, area, distanceUnit);
            label.label = `${result.value} ${result.unit}`;
            label.position = bounds.getCenter();
            label.setMap(map);
          }
        }
      }
    },

    finish() {
      label.setMap(null);
      points.removeObjects(points);
    }
  };
}
