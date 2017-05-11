class MarkerLabel extends google.maps.OverlayView {
  constructor(options) {
    super(...arguments);

    var self = this;
    this.setValues(options);

    this.position = options.position;
    
    // Create the label container
    this.div = document.createElement('div');
    this.div.className = '';
   
    // Trigger the marker click handler if clicking on the label
    google.maps.event.addDomListener(this.div, 'click', function(e){
      (e.stopPropagation) && e.stopPropagation();
      google.maps.event.trigger(self.marker, 'click');
    });
  }

  onAdd() {
    var pane = this.getPanes().overlayImage.appendChild(this.div);
    var self = this;

    this.listeners = [
      google.maps.event.addListener(this, 'position_changed', function() { self.draw(); }),
      google.maps.event.addListener(this, 'text_changed', function() { self.draw(); }),
      google.maps.event.addListener(this, 'zindex_changed', function() { self.draw(); })
    ];
  }

  // Marker Label onRemove
  onRemove() {
    this.div.parentNode.removeChild(this.div);

    for (var i = 0, I = this.listeners.length; i < I; ++i) {
      google.maps.event.removeListener(this.listeners[i]);
    }
  }

  // Implement draw
  draw() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    var div = this.div;

    this.div.innerHTML = this.get('text').toString();

    div.style.zIndex = this.get('zIndex'); // Allow label to overlay marker
    div.style.position = 'absolute';
    div.style.display = 'block';
    div.style.left = (position.x - (div.offsetWidth / 2) + 10) + 'px';
    div.style.top = (position.y - div.offsetHeight - 10) + 'px';
  }

  set position(value) {
    this.latlng = value;
  }

  get position() {
    return this.latlng;
  }
}

export default MarkerLabel;
