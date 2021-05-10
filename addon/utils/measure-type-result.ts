import { A } from '@ember/array';
import commaifyNumber from './number-commas';
import area from './area';
import distance from './distance';
import optionsData from './options-data';

export type Options = {
  [M in keyof typeof optionsData]: typeof optionsData[M];
};
export type OptionId = keyof Options;
export type Option = Options[OptionId];

const validTypes: OptionId[] = ['polyline', 'polygon', 'circle', 'rectangle'];

export default function measureTypeResult(
  type: OptionId,
  value: number,
  unitId: string
) {
  const option = optionsData[type];

  if (!isValidType(type, option)) {
    return;
  }

  const units = A<typeof option.distanceUnits[0]>(option.distanceUnits);
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

function isValidType(
  type: OptionId,
  option: unknown
): option is
  | Options['circle']
  | Options['rectangle']
  | Options['polygon']
  | Options['polyline'] {
  if (validTypes.includes(type)) {
    return true;
  }
  return false;
}
