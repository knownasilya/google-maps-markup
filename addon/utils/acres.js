const ACRE = 2.29568e-5;

export default function acres(result) {
  var output = {};

  if (result.value > 43560) {
    output.value = result.value * ACRE;
    output.unit = 'ac.';

    if (output.value < 1) {
      // 4 decimal places
      output.value = Math.round(output.value * 10000) / 10000;
    } else if (output.value >= 1 && output.value < 10) {
      // 1 decimal place
      output.value = Math.round(output.value * 10) / 10;
    } else {
      output.value = Math.round(output.value);
    }
  } else {
    output.value = Math.round(result.value);
    output.unit = result.unit;
  }

  output.measurementType = result.measurementType;

  return output.value !== undefined ? output : result;
}
