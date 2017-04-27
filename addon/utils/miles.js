export default function miles(result) {
  var output = {};
  var FEET_DISTANCE_CONVERT_MAP = {
    mi: 0.000189394,
    km: 0.0003048,
    meter: 0.3048,
  };

  if(result.unit === 'ft') {
    output.value = Math.round(result.value);
    output.unit = result.unit;
  } else {
    output.value = result.value * FEET_DISTANCE_CONVERT_MAP[result.unit];
    output.unit = result.unit;

    if (output.value < 1) {
      // 4 decimal places
      output.value = Math.round(output.value * 10000) / 10000;
    } else if (output.value >= 1 && output.value < 10) {
      // 1 decimal place
      output.value = Math.round(output.value * 10) / 10;
    } else {
      output.value = Math.round(output.value);
    }
  }

  output.measurementType = result.measurementType;

  return output.value !== undefined ? output : result;
}
