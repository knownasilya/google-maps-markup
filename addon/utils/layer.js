import RSVP from 'rsvp';

class Layer {
  constructor(options) {
    this.isHidden = options.isHidden || false;
    this.data = options.data;
    this.textData = options.textGeoJson || [];
  }

  toGeoJson() {
    let textData = this.textData;

    return new RSVP.Promise((resolve) => {
      this.data.toGeoJson((data) => {
        data.features = data.features.concat(textData);
        resolve(data);
      });
    });
  }
}

export default Layer;
