import commaifyNumber from './number-commas';
import acres from './acres';
import miles from './miles';

export default function measureTypeResult(type, value) {
  var result = {
    measurementType: 'Distance',
    unit: 'ft',
    value: 0
  };

  switch(type) {
    case 'polyline': {
      // meters->feet conversion
      result.value = value * 3.28084
      result = miles(result);
      break;
    }

    case 'circle':
    case 'rectangle':
    case 'polygon': {
      // sq. meters-> sq. feet
      result.value = value * 10.7639;
      result.measurementType = 'Area';
      result.unit = 'sq. ft.';
      result = acres(result);
      break;
    }
  }

  result.value = commaifyNumber(result.value);
  return result;
}
