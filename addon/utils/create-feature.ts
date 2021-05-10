import guid from './guid';

export default function createFeature(
  geometry:
    | google.maps.Data.Geometry
    | google.maps.LatLng
    | google.maps.LatLngLiteral
): google.maps.Data.Feature {
  const feature = new google.maps.Data.Feature({
    id: guid(),
    geometry,
  });

  return feature;
}
