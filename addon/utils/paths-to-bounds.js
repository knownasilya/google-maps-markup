export default function pathsToBounds(paths) {
  let bounds = new google.maps.LatLngBounds();

  paths.forEach(latlng => {
    bounds.extend(latlng);
  });

  return bounds;
}
