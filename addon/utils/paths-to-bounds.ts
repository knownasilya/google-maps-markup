export default function pathsToBounds(
  paths: google.maps.LatLng[]
): google.maps.LatLngBounds {
  const bounds = new google.maps.LatLngBounds();

  paths.forEach((latlng) => {
    bounds.extend(latlng);
  });

  return bounds;
}
