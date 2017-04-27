const ACRE = 2.29568e-5;

export default function acres(result) {
  var output = {};
  var SQUARE_FEET_AREA_CONVERT_MAP = {
    'acres': 2.29568e-5,
    'sq km': 9.2903e-8,
    'sq mi': 3.587e-8,
    'sq ft': 1,
  };

  if (result.unit === 'sq ft') {
    output.value = Math.round(result.value);
  } else {
    output.value = result.value * SQUARE_FEET_AREA_CONVERT_MAP[result.unit];

    if (output.value < 1) {
      // 4 decimal places
      output.value = Math.round(output.value * 100000000) / 100000000;
    } else if (output.value >= 1 && output.value < 10) {
      // 1 decimal place
      output.value = Math.round(output.value * 10) / 10;
    } else {
      output.value = Math.round(output.value);
    }
  }

  output.unit = result.unit;
  output.measurementType = result.measurementType;

  return output.value !== undefined ? output : result;
}
