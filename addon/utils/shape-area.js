export function polygonArea(polygon) {
  let geometry = polygon.getGeometry();

  return google.maps.geometry.spherical.computeArea(
    geometry.getArray()[0].getArray()
  );
}

export function circleArea(circle) {
  let geometry = circle.getGeometry();

  return google.maps.geometry.spherical.computeArea(
    geometry.getArray()[0].getArray()
  );
}

export function rectangleArea(rectangle) {
  let geometry = rectangle.getGeometry();

  return google.maps.geometry.spherical.computeArea(
    geometry.getArray()[0].getArray()
  );
}
