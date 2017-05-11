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
      { name: 'Font Size', type: 'size', id: 'style.fontSize' },
      { name: 'Color', type: 'color', id: 'style.color' }
    ],
    style: {
      color: '#374046',
      fontSize: '12'
    },
    fontSizes: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  },
  marker: {
    id: 'marker',
    dataId: 'Point',
    name: 'Marker',
    title: 'Marker Tool',
    options: [
      { name: 'Icon', type: 'icon', id: 'icon', display: 'icon.display' },
      { name: 'Color', type: 'color', id: 'style.color' },
    ],
    style: {
      color: '#374046',
    },
    icons: [{
      id: 'default',
      display: 'Default',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'grade',
      display: 'Grade',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'help',
      display: 'Help',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'favorite',
      display: 'Favorite',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'check_circle',
      display: 'Check Circle',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'lens',
      display: 'Lens',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'filter_vintage',
      display: 'Filter Vintage',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'photo_camera',
      display: 'Photo Camera',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }, {
      id: 'place',
      display: 'Place',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }],
    icon: {
      id: 'default',
      display: 'Default',
      path: 'M22-48h-44v43h16l6 5 6-5h16z',
    },
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
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      fillOpacity: 0.5
    },
    fillColorTransparent: true,
  },
  freeFormPolygon: {
    id: 'freeFormPolygon',
    name: 'Freeform Polygon',
    title: 'Freeform Polygon Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046'
    },
    fillColorTransparent: true,
  },
  circle: {
    id: 'circle',
    dmId: google.maps.drawing.OverlayType.CIRCLE,
    name: 'Circle',
    title: 'Circle Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      fillOpacity: 0.5
    },
    fillColorTransparent: true,
  },
  rectangle: {
    id: 'rectangle',
    dmId: google.maps.drawing.OverlayType.RECTANGLE,
    name: 'Rectangle',
    title: 'Rectangle Tool',
    options: [
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      fillOpacity: 0.5
    },
    fillColorTransparent: true,
  }
};
