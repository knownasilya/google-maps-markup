export default function featureCenter(feature) {
  var geometry = feature.getGeometry()
  var type = geometry.getType();

  switch(type) {
    case 'Point': {
      return geometry.get();
    }
  }
}
