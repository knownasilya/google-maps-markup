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
      { name: 'Marker', type: 'Marker', id: 'marker', display: 'marker.display' },
      { name: 'Icon', type: 'icon', id: 'icon', display: 'icon.display' },
      { name: 'Color', type: 'color', id: 'style.color' },
    ],
    style: {
      color: '#374046',
    },
    icons: [{
      id: 'default',
      display: 'Default'
    }, {
      id: 'grade',
      display: 'Grade'
    }, {
      id: 'help',
      display: 'Help'
    }, {
      id: 'favorite',
      display: 'Favorite'
    }, {
      id: 'check_circle',
      display: 'Check Circle'
    }, {
      id: 'lens',
      display: 'Lens'
    }, {
      id: 'filter_vintage',
      display: 'Filter Vintage'
    }, {
      id: 'photo_camera',
      display: 'Photo Camera'
    }, {
      id: 'place',
      display: 'Place'
    }],
    icon: {
      id: 'default',
      display: 'Default'
    },

    markers: [{
      id: 'default',
      display: 'Default',
    }, {
      id: 'pin',
      display: 'Pin',
      path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
      pathDropdown: 'M24 0c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z'
    }, {
      id: 'squarePin',
      display: 'Square Pin',
      path: 'M22-48h-44v43h16l6 5 6-5h16z',
      pathDropdown: 'M45.5 0h-43v43h16.2l5.9 5 5.8-5h15.1z'
    }],
    marker: {
      id: 'default',
      display: 'Default',
    }
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
