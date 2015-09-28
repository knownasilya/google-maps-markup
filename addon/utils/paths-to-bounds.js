export default function pathsToBounds(paths) {
  var bounds = new google.maps.LatLngBounds();

  paths.forEach(latlng => {
    bounds.extend(latlng);
  });

  return bounds;
}
