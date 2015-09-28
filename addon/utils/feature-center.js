import pathsToBounds from './paths-to-bounds';

export default function featureCenter(feature) {
  var geometry = feature.getGeometry();
  var type = geometry.getType();

  switch(type) {
    case 'Point': {
      return geometry.get();
    }

    case 'Polygon': {
      let paths = geometry.getArray()[0].getArray();
      let bounds = pathsToBounds(paths);

      return bounds.getCenter();
    }

    case 'LineString': {
      let paths = geometry.getArray();
      let bounds = pathsToBounds(paths);

      return bounds.getCenter();
    }
  }
}

