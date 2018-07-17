import formatNumber from './format-number';

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
  let unitId = result.unit.id;
  let output = {};

  while (nextUnitIfBeyondThreshold(result.value, unitId)) {
    let nextOptions = NEXT_UNIT[unitId];

    unitId = nextOptions.unit;
  }

  let converted = result.value * SQUARE_FEET_AREA_CONVERT_MAP[unitId];

  output.value = formatNumber(converted);
  output.unit = unitId;
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