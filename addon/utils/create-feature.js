import guid from './guid';

export default function createFeature(geometry) {
  let feature = new google.maps.Data.Feature({
    id: guid(),
    geometry
  });

  return feature;
}
