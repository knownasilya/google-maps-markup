const LatLng = google.maps.LatLng;
const computeArea = google.maps.geometry.spherical.computeArea;

export function polygonArea(polygon) {
  return computeArea(polygon.getPath());
}

export function circleArea(circle) {
  var radius = circle.getRadius();

  return Math.PI * (radius * radius);
}

export function rectangleArea(rectangle) {
  var bounds = rectangle.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  var nw = new LatLng(ne.lat(), sw.lng());
  var se = new LatLng(sw.lat(), ne.lng());
  var path = [ne, se, sw, nw];

  return computeArea(path);
}
