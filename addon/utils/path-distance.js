export default function pathDistance(points) {
  let processed = [];
  let value = points.reduce((val, point) => {
    var lastIndex = processed.length ? processed.length - 1 : undefined;

    if (lastIndex !== undefined) {
      let last = processed[lastIndex];
      value += google.maps.geometry.spherical.computeDistanceBetween(last, point);
    }

    processed.push(point);

    return value;
  }, 0);

  return value;
}
