import pathsToBounds from './paths-to-bounds';

export default function labelPlotter(label, points, type, event, map) {
  console.log('[plotter] created');
  if (type === 'circle') {
    label.label = 'temmp';
    label.position = points[0];
    label.setMap(map);
  }

  return {
    update(points) {

      switch(type) {
        case 'circle': {
          console.log('circle');
          return;
        }
        default: {
          if (points.length > 1) {
            let bounds = pathsToBounds(points);
            label.position = bounds.getCenter();
          }
        }
      }

      label.label = 'temmp';
      label.setMap(map);
      console.log('[plotter] updated');
    },

    finish() {
      label.setMap(null);
      points.clear();
      console.log('[plotter] finished');
    }
  };
}
