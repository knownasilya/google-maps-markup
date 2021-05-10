const d2r = Math.PI / 180; // degrees to radians
const r2d = 180 / Math.PI; // radians to degrees
const earthsradius = 3963; // 3963 is the radius of the earth in miles

export default function createCircle(
  lat: number,
  lng: number,
  radius: number
): google.maps.LatLng[] {
  const points = 32;

  // radius in miles
  radius = radius * 0.000621371;

  // find the radius in lat/lon
  const rlat = (radius / earthsradius) * r2d;
  const rlng = rlat / Math.cos(lat * d2r);
  const path: google.maps.LatLng[] = [];

  // one extra here makes sure we connect the
  for (let i = 0; i < points + 1; i++) {
    const theta = Math.PI * (i / (points / 2));
    const ex = lng + rlng * Math.cos(theta); // center a + radius x * cos(theta)
    const ey = lat + rlat * Math.sin(theta); // center b + radius y * sin(theta)
    path.push(new google.maps.LatLng(ey, ex));
  }

  return path;
}
