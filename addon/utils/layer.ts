import RSVP from 'rsvp';

class Layer {
  isHidden: boolean;
  data: google.maps.Data;
  textData: any[];

  constructor(options: {
    isHidden?: boolean;
    featureFactory?: () => any;
    textGeoJson?: any[];
  }) {
    this.isHidden = options.isHidden ?? false;
    this.data = new google.maps.Data({
      featureFactory: options.featureFactory,
    });
    this.textData = options.textGeoJson || [];
  }

  toGeoJson(): Promise<GeoJSON.FeatureCollection> {
    const textData = this.textData;

    return new RSVP.Promise((resolve) => {
      this.data.toGeoJson((data: GeoJSON.FeatureCollection) => {
        data.features = data.features.concat(textData);
        resolve(data);
      });
    });
  }
}

export default Layer;
