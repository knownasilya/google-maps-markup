export default function createFeature(geometry, results) {
  var id = results.get('length') + 1;
  var feature = new google.maps.Data.Feature({
    id: id,
    geometry: geometry
  });

  return feature;
}
