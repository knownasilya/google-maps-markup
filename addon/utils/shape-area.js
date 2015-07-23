const computeArea = google.maps.geometry.spherical.computeArea;

export function polygonArea(polygon) {
  var geometry = polygon.getGeometry();

  return computeArea(geometry.getArray()[0].getArray());
}

export function circleArea(circle) {
  var geometry = circle.getGeometry();

  return computeArea(geometry.getArray()[0].getArray());
}

export function rectangleArea(rectangle) {
  var geometry = rectangle.getGeometry();

  return computeArea(geometry.getArray()[0].getArray());
}
