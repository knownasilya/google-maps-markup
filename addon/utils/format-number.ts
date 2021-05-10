export default function formatNumber(value: number): number {
  if (value < 1) {
    // 4 decimal places
    value = Math.round(value * 10000) / 10000;
  } else if (value >= 1 && value < 10) {
    // 1 decimal place
    value = Math.round(value * 10) / 10;
  } else {
    value = Math.round(value);
  }

  return value;
}
