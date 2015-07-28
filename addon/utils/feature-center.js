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

function pathsToBounds(paths) {
  var bounds = new google.maps.LatLngBounds();

  paths.forEach(latlng => {
    bounds.extend(latlng);
  });

  return bounds;
}
