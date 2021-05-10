export default function pathDistance(points: google.maps.LatLng[]): number {
  const processed: google.maps.LatLng[] = [];
  const value = points.reduce((val, point) => {
    const lastIndex = processed.length ? processed.length - 1 : undefined;

    if (lastIndex !== undefined) {
      const last = processed[lastIndex];
      val += google.maps.geometry.spherical.computeDistanceBetween(last, point);
    }

    processed.push(point);

    return val;
  }, 0);

  return value;
}
