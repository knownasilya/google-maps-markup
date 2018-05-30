const computeArea = google.maps.geometry.spherical.computeArea;

export function polygonArea(polygon) {
  let geometry = polygon.getGeometry();

  return computeArea(geometry.getArray()[0].getArray());
}

export function circleArea(circle) {
  let geometry = circle.getGeometry();

  return computeArea(geometry.getArray()[0].getArray());
}

export function rectangleArea(rectangle) {
  let geometry = rectangle.getGeometry();

  return computeArea(geometry.getArray()[0].getArray());
}
