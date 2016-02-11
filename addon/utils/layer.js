import Ember from 'ember';

const { RSVP } = Ember;

class Layer {
  constructor(options) {
    this.isHidden = options.isHidden || false;
    this.data = options.data;
    this.textData = options.textGeoJson || [];
  }

  toGeoJson() {
    var textData = this.textData;

    return new RSVP.Promise(resolve => {
      this.data.toGeoJson(data => {
        data.features = data.features.concat(textData);
        resolve(data);
      });
    });
  }
}

export default Layer;
