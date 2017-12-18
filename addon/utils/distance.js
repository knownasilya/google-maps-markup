const FEET_DISTANCE_CONVERT_MAP = {
  mi: 0.000189394,
  km: 0.0003048,
  meter: 0.3048,
};

export default function miles(result) {
  let output = {};

  if(result.unit.id === 'ft') {
    output.value = Math.round(result.value);
  } else {
    output.value = result.value * FEET_DISTANCE_CONVERT_MAP[result.unit.id];

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

  output.unit = result.unit;
  output.measurementType = result.measurementType;

  return output.value !== undefined ? output : result;
}
