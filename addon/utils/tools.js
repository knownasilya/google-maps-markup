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
      { name: 'Icon', type: 'icon', id: 'icon', display: 'icon.display' },
      { name: 'Color', type: 'color', id: 'style.color' },
    ],
    style: {
      color: '#374046',
    },
    icons: [{
      id: 'default',
      display: 'Default',
      path: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
    }, {
      id: 'pin',
      display: 'Pin',
      path: 'M1.1,0A1.7,1.7,0,0,1,.7-.7C.3-1.9-.3-3-.8-4.2L-1.9-6.8l-1.3-3-1.1-2.6-1.9-4.3-1.1-2.5-1.3-3.1c-.4-.9-.7-1.7-1.1-2.6s-.5-1.2-.8-1.9a5.2,5.2,0,0,1-.3-1.7,9.2,9.2,0,0,1,.3-3.5,10.1,10.1,0,0,1,2-3.7,12.2,12.2,0,0,1,2.2-2,12.8,12.8,0,0,1,5-2.1,13.3,13.3,0,0,1,6.8.4,12.2,12.2,0,0,1,3.4,1.7,12.6,12.6,0,0,1,2.7,2.7,6.4,6.4,0,0,1,.6,1.1,8.3,8.3,0,0,1,.6,6.2A26.3,26.3,0,0,1,11.2-24l-.6,1.4c-.4.8-.7,1.7-1,2.5l-1.2,3L7.2-14.4,5.9-11.2,4.7-8.5,3.5-5.6,2.3-2.8Z'
    }, {
      id: 'squarePin',
      display: 'Square Pin',
      path: 'M22-48h-44v43h16l6 5 6-5h16z'
    }],
    icon: {
      id: 'default',
      display: 'Default',
      path: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
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
