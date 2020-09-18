import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { all, resolve } from 'rsvp';

export default Controller.extend({
  markupDataService: service('markupData'),

  exportMarkup() {
    let dataLayers = this.get('markupDataService.layers');

    if (dataLayers) {
      let promises = dataLayers.map((layer) => {
        return layer.toGeoJson();
      });

      return all(promises).then((layers) => {
        // make sure empty feature collections aren't exported
        this.set('exported', layers);
        return layers;
      });
    } else {
      return resolve();
    }
  },

  loadMarkup(markupData) {
    let markupService = this.markupDataService;
    let dataLayers = markupService.layers;

    dataLayers.forEach((layer, index) => {
      layer.data.addGeoJson(markupData[index]);
      layer.data.forEach((feature) =>
        markupService.featureToResult(feature, layer)
      );
    });

    markupService.changeModeByResults();
  },

  actions: {
    load() {
      let exported = this.exported;

      if (exported) {
        this.loadMarkup(exported);
      }
    },

    save() {
      this.exportMarkup();
    },
  },
});
