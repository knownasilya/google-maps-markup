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
    title: 'Marker Tool'
  },
  polyline: {
    id: 'polyline',
    dataId: 'LineString',
    name: 'Line',
    title: 'Multi segmented line tool',
    options: [
      { name: 'Distance Unit', type: 'distanceUnit', id: 'distanceUnit' },
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      strokeWeight: 2
    },
    strokeWeights: [2, 4, 6, 8, 10]
    distanceUnits: [{
      id: 'ft',
      display: 'Feet'
    }, {
      id: 'meter',
      display: 'Meters'
    }, {
      id: 'mi',
      display: 'Miles'
    }, {
      id: 'km',
      display: 'Kilometers'
    }],
    distanceUnit: {
      id: 'ft',
      display: 'Feet'
    }
  },
  polygon: {
    id: 'polygon',
    dataId: 'Polygon',
    name: 'Polygon',
    title: 'Polygon Tool',
    options: [
      { name: 'Area Unit', type: 'distanceUnit', id: 'distanceUnit' },
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      strokeWeight: 2,
      fillOpacity: 0.5
    },
    fillColorTransparent: true,
    strokeWeights: [2, 4, 6, 8, 10],
    distanceUnits: [{
      id: 'sq ft',
      display: 'Sq Ft'
    }, {
      id: 'acres',
      display: 'Acres'
    }, {
      id: 'sq mi',
      display: 'Sq Miles'
    }, {
      id: 'sq km',
      display: 'Sq Km'
    }],
    distanceUnit: {
      id: 'sq ft',
      display: 'Sq Ft'
    }
  },
  freeFormPolygon: {
    id: 'freeFormPolygon',
    name: 'Freeform Polygon',
    title: 'Freeform Polygon Tool',
    options: [
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' },
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      strokeWeight: 2
    },
    fillColorTransparent: true,
    strokeWeights: [2, 4, 6, 8, 10]
  },
  circle: {
    id: 'circle',
    dmId: google.maps.drawing.OverlayType.CIRCLE,
    name: 'Circle',
    title: 'Circle Tool',
    options: [
      { name: 'Area Unit', type: 'distanceUnit', id: 'distanceUnit' },
      { name: 'Line Width', type: 'width', id: 'style.strokeWeight' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      fillOpacity: 0.5,
      strokeWeight: 2
    },
    fillColorTransparent: true,
    strokeWeights: [2, 4, 6, 8, 10],
    distanceUnits: [{
      id: 'sq ft',
      display: 'Sq Ft'
    }, {
      id: 'acres',
      display: 'Acres'
    }, {
      id: 'sq mi',
      display: 'Sq Miles'
    }, {
      id: 'sq km',
      display: 'Sq Km'
    }],
    distanceUnit: {
      id: 'sq ft',
      display: 'Sq Ft'
    }
  },
  rectangle: {
    id: 'rectangle',
    dmId: google.maps.drawing.OverlayType.RECTANGLE,
    name: 'Rectangle',
    title: 'Rectangle Tool',
    options: [
      { name: 'Area Unit', type: 'distanceUnit', id: 'distanceUnit' },
      { name: 'Fill Color', type: 'color', id: 'style.fillColor', fillOptional: true },
      { name: 'Stroke Color', type: 'color', id: 'style.strokeColor' }
    ],
    style: {
      strokeColor: '#374046',
      fillColor: '#374046',
      fillOpacity: 0.5,
      strokeWeight: 2
    },
    fillColorTransparent: true,
    strokeWeights: [2, 4, 6, 8, 10],
    distanceUnits: [{
      id: 'sq ft',
      display: 'Sq Ft'
    }, {
      id: 'acres',
      display: 'Acres'
    }, {
      id: 'sq mi',
      display: 'Sq Miles'
    }, {
      id: 'sq km',
      display: 'Sq Km'
    }],
    distanceUnit: {
      id: 'sq ft',
      display: 'Sq Ft'
    }
  }
};
