export default {
  pan: {
    id: 'pan',
    name: 'Pan',
    title: 'Pan Tool'
  },
  text: {
    id: 'text',
    name: 'Text',
    title: 'Text Label Tool',
    options: [
      { name: 'Color', type: 'color', id: 'style.color' }
    ],
    style: {
      color: '#374046'
    }
  },
  marker: {
    id: 'marker',
    dataId: 'Point',
    name: 'Marker',
    title: 'Marker Tool'
  },
  polyline: {
    id: 'polyline',
    dataId: 'LineString',
    name: 'Line',
    title: 'Multi segmented line tool',
    options: [
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Color', type: 'color', id: 'style.strokeColor' },
    ],
    style: {
      strokeColor: '#374046',
      strokeWeight: 2
    },
    strokeWeights: [2, 4, 6, 8, 10]
  },
  polygon: {
    id: 'polygon',
    dataId: 'Polygon',
    name: 'Polygon',
    title: 'Polygon Tool',
    options: [
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' },
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      strokeWeight: 2
    },
    strokeWeights: [2, 4, 6, 8, 10]
  },
  freeFormPolygon: {
    id: 'freeFormPolygon',
    name: 'Freeform Polygon',
    title: 'Freeform Polygon Tool',
    options: [
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' },
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      strokeWeight: 2
    },
    strokeWeights: [2, 4, 6, 8, 10]
  },
  circle: {
    id: 'circle',
    dmId: google.maps.drawing.OverlayType.CIRCLE,
    name: 'Circle',
    title: 'Circle Tool',
    options: [
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' },
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      strokeWeight: 2
    },
    strokeWeights: [2, 4, 6, 8, 10]
  },
  rectangle: {
    id: 'rectangle',
    dmId: google.maps.drawing.OverlayType.RECTANGLE,
    name: 'Rectangle',
    title: 'Rectangle Tool',
    options: [
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' },
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      strokeWeight: 2
    },
    strokeWeights: [2, 4, 6, 8, 10 ]
  }
};
