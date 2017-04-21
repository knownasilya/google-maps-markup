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
    title: 'Marker Tool',
    options: [
      { name: 'Icon', type: 'icon', id: 'icon.id', display: 'icon.display' },
      { name: 'Color', type: 'color', id: 'style.color' },
      { name: 'Color Hover', type: 'color', id: 'style.hoverColor' },
    ],
    style: {
      color: '#374046',
      hoverColor: '#374046',
    },
    icons: [{
      id: 'default',
      display: 'Default',
      path: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
    }, {
      id: 'pin',
      display: 'Pin',
      path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z'
    }, {
      id: 'squarePin',
      display: 'Square Pin',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }],
    icon: 'default',
  },
  polyline: {
    id: 'polyline',
    dataId: 'LineString',
    name: 'Line',
    title: 'Multi segmented line tool',
    options: [
      { name: 'Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046'
    }
  },
  polygon: {
    id: 'polygon',
    dataId: 'Polygon',
    name: 'Polygon',
    title: 'Polygon Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046'
    }
  },
  freeFormPolygon: {
    id: 'freeFormPolygon',
    name: 'Freeform Polygon',
    title: 'Freeform Polygon Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046'
    }
  },
  circle: {
    id: 'circle',
    dmId: google.maps.drawing.OverlayType.CIRCLE,
    name: 'Circle',
    title: 'Circle Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046'
    }
  },
  rectangle: {
    id: 'rectangle',
    dmId: google.maps.drawing.OverlayType.RECTANGLE,
    name: 'Rectangle',
    title: 'Rectangle Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor' },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046'
    }
  }
};
