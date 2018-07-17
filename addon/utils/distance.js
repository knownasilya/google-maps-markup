import formatNumber from './format-number';

const FEET_DISTANCE_CONVERT_MAP = {
  mi: 0.000189394,
  km: 0.0003048,
  meter: 0.3048,
  ft: 1,
};
const NEXT_UNIT = {
  'ft': {
    unit: 'mi',
    threshold: 1320
  },
  'meter': {
    unit: 'km',
    threshold: 1000
  }
};

export default function miles(result) {
  let unitId = result.unit.id;
  let output = {};

  while (nextUnitIfBeyondThreshold(result.value, unitId)) {
    let nextOptions = NEXT_UNIT[unitId];

    unitId = nextOptions.unit;
  }

  let converted = result.value * FEET_DISTANCE_CONVERT_MAP[unitId];

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
