const SQUARE_FEET_AREA_CONVERT_MAP = {
  'acres': 2.29568e-5,
  'sq km': 9.2903e-8,
  'sq mi': 3.587e-8,
  'sq ft': 1,
};
const NEXT_UNIT = {
  'sq ft': {
    unit: 'acres',
    threshold: 43560
  },
  'acres': {
    unit: 'sq mi',
    threshold: 27880000
  }
};

export default function acres(result) {
  let unit = result.unit;
  let output = {};

  while (nextUnitIfBeyondThreshold(result.value, unit)) {
    let nextOptions = NEXT_UNIT[unit];

    unit = nextOptions.unit;
  }

  output.value = result.value * SQUARE_FEET_AREA_CONVERT_MAP[unit];

  if (output.value < 1) {
    // 4 decimal places
    output.value = Math.round(output.value * 100000000) / 100000000;
  } else if (output.value >= 1 && output.value < 10) {
    // 1 decimal place
    output.value = Math.round(output.value * 10) / 10;
  } else {
    output.value = Math.round(output.value);
  }

  output.unit = unit;
  output.measurementType = result.measurementType;

  return output.value !== undefined ? output : result;
}

function nextUnitIfBeyondThreshold(value, unit) {
  let nextOptions = NEXT_UNIT[unit];

  if (!nextOptions) {
    return false;
  }

  if (value > nextOptions.threshold) {
    return true;
  }
}