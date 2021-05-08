import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { all, resolve } from 'rsvp';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service('markupData') markupDataService;
  @tracked exported;

  async exportMarkup() {
    let dataLayers = this.markupDataService.layers;

    if (dataLayers) {
      let promises = dataLayers.map((layer) => {
        return layer.toGeoJson();
      });

      let layers = await all(promises);

      // make sure empty feature collections aren't exported
      this.exported = layers;

      return layers;
    } else {
      return;
    }
  }

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
  }

  @action
  load() {
    let exported = this.exported;

    if (exported) {
      this.loadMarkup(exported);
    }
  }

  @action
  save() {
    this.exportMarkup();
  }
}
