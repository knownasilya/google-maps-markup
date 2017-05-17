import commaifyNumber from './number-commas';
import acres from './acres';
import Ember from 'ember';
import miles from './miles';
import optionsData from './options-data';

export default function measureTypeResult(type, value, distanceUnitId) {
  let units = Ember.A(optionsData[type].distanceUnits);
  let result = {
    measurementType: 'Distance',
    unit: units && units.findBy('id', distanceUnitId),
    value: 0
  };

  switch(type) {
    case 'polyline': {
      // meters->feet conversion
      result.value = value * 3.28084;
      result = miles(result);
      break;
    }

    case 'circle':
    case 'rectangle':
    case 'polygon': {
      // sq. meters-> sq. feet
      result.value = value * 10.7639;
      result.measurementType = 'Area';
      result = acres(result);
      break;
    }
  }

  result.value = commaifyNumber(result.value);
  return result;
}
