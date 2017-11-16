export default function pathDistance(points) {
  let processed = [];
  let value = points.reduce((val, point) => {
    var lastIndex = processed.length ? processed.length - 1 : undefined;

    if (lastIndex !== undefined) {
      let last = processed[lastIndex];
      val += google.maps.geometry.spherical.computeDistanceBetween(last, point);
    }

    processed.push(point);

    return val;
  }, 0);

  return value;
}
