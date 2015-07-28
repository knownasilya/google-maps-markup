import createCircle from './create-circle';
import createFeature from './create-feature';

const {
  Polygon
} = google.maps.Data;
const {
  LatLng
} = google.maps;

export default function overlayToFeature(type, overlay) {
  var paths;

  switch(type) {
    case 'circle': {
      let center = overlay.getCenter();
      let radius = overlay.radius;

      paths = [createCircle(center.lat(), center.lng(), radius)];
      break;
    }

    case 'rectangle': {
      let bounds = overlay.getBounds();
      let ne = bounds.getNorthEast();
      let sw = bounds.getSouthWest();
      let nw = new LatLng(ne.lat(), sw.lng());
      let se = new LatLng(sw.lat(), ne.lng());
      let path = [ne, se, sw, nw];

      paths = [path];
      break;
    }
  }

  let polygon = new Polygon(paths);
  let feature = createFeature(polygon);

  return feature;
}
