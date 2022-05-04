import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service('markupData') markupDataService;
  @tracked exported;
  @tracked map;

  async exportMarkup() {
    if (this.markupDataService.layer) {
      let geojson = await this.markupDataService.layer.toGeoJson();

      // make sure empty feature collections aren't exported
      this.exported = geojson;

      return geojson;
    } else {
      return;
    }
  }

  loadMarkup(markupData) {
    let layer = this.markupDataService.layer;

    layer.data.addGeoJson(markupData);
    layer.data.forEach((feature) =>
      this.markupDataService.featureToResult(feature, layer)
    );
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
