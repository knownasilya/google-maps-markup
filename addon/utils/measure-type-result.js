import { A } from '@ember/array';
import commaifyNumber from './number-commas';
import area from './area';
import distance from './distance';
import optionsData from './options-data';

export default function measureTypeResult(type, value, unitId) {
  let units = A(optionsData[type].distanceUnits);
  let result = {
    measurementType: 'Distance',
    unit: units && units.findBy('id', unitId),
    value: 0,
  };

  switch (type) {
    case 'polyline': {
      // meters->feet conversion
      result.value = value * 3.28084;
      result = distance(result);
      // Reset the correct unit format
      result.unit = units && units.findBy('id', result.unit);
      break;
    }

    case 'circle':
    case 'rectangle':
    case 'polygon': {
      // sq. meters-> sq. feet
      result.value = value * 10.7639;
      result.measurementType = 'Area';
      result = area(result);
      // Reset the correct unit format
      result.unit = units.findBy('id', result.unit);
      break;
    }
  }

  result.value = commaifyNumber(result.value);
  return result;
}
