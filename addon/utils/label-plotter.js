import pathsToBounds from './paths-to-bounds';
import pathDistance from './path-distance';
import measureTypeResult from './measure-type-result';

export default function labelPlotter(
  label,
  points,
  type,
  event,
  map,
  distanceUnitId
) {
  if (type === 'circle') {
    label.position = points[0];
  }

  return {
    update(points) {
      switch (type) {
        case 'pan':
          return;

        case 'circle': {
          if (points.length === 2) {
            let radius = google.maps.geometry.spherical.computeDistanceBetween(
              points[0],
              points[1]
            );
            let area = Math.PI * (radius * radius);
            let result = measureTypeResult(type, area, distanceUnitId);

            label.label = `${result.value} ${result.unit.display}`;
            label.setMap(map);
          }
          break;
        }

        case 'polyline': {
          if (points.length >= 2) {
            let bounds = pathsToBounds(points);
            let distance = pathDistance(points);
            let result = measureTypeResult(type, distance, distanceUnitId);

            label.label = `${result.value} ${result.unit.display}`;
            label.position = bounds.getCenter();
            label.setMap(map);
          }
          break;
        }

        case 'rectangle': {
          if (points.length === 2) {
            let calcPoints = [
              points[0],
              new google.maps.LatLng(points[0].lat(), points[1].lng()),
              points[1],
              new google.maps.LatLng(points[1].lat(), points[0].lng()),
            ];
            let bounds = pathsToBounds(calcPoints);
            let area = google.maps.geometry.spherical.computeArea(calcPoints);
            let result = measureTypeResult(type, area, distanceUnitId);

            label.label = `${result.value} ${result.unit.display}`;
            label.position = bounds.getCenter();
            label.setMap(map);
          }
          break;
        }

        case 'polygon': {
          if (points.length < 3) {
            break;
          }
          // move on to default
        }

        // eslint-disable-next-line no-fallthrough
        default: {
          if (points.length > 1) {
            let bounds = pathsToBounds(points);
            let area = google.maps.geometry.spherical.computeArea(points);
            let result = measureTypeResult(type, area, distanceUnitId);
            label.label = `${result.value} ${result.unit.display}`;
            label.position = bounds.getCenter();
            label.setMap(map);
          }
        }
      }
    },

    finish() {
      label.setMap(null);
      points.removeObjects(points);
    },
  };
}
