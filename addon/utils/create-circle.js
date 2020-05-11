const d2r = Math.PI / 180; // degrees to radians
const r2d = 180 / Math.PI; // radians to degrees
const earthsradius = 3963; // 3963 is the radius of the earth in miles

export default function createCircle(lat, lng, radius) {
  var points = 32;

  // radius in miles
  radius = radius * 0.000621371;

  // find the raidus in lat/lon
  var rlat = (radius / earthsradius) * r2d;
  var rlng = rlat / Math.cos(lat * d2r);
  var path = [];

  // one extra here makes sure we connect the
  for (let i = 0; i < points + 1; i++) {
    let theta = Math.PI * (i / (points / 2));
    let ex = lng + rlng * Math.cos(theta); // center a + radius x * cos(theta)
    let ey = lat + rlat * Math.sin(theta); // center b + radius y * sin(theta)
    path.push(new google.maps.LatLng(ey, ex));
  }

  return path;
}
