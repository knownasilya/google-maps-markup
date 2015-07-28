import guid from './guid';

export default function createFeature(geometry) {
  var feature = new google.maps.Data.Feature({
    id: guid(),
    geometry: geometry
  });

  return feature;
}
