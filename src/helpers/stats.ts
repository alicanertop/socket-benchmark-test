interface Stat {
  max: number;
  min: number;
  avg: number;
  p95: number;
  p99: number;
  jitter: number;
}
export const calculateStats = (numbers: number[]): Stat => {
  if (!numbers.length)
    return { avg: 0, max: 0, min: 0, p95: 0, p99: 0, jitter: 0 };

  const sorted = numbers.sort((a, b) => a - b);
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);

  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  };

  let totalJitter = 0;
  for (let i = 1; i < numbers.length; i++) {
    totalJitter += Math.abs(numbers[i] - numbers[i - 1]);
  }

  return {
    avg: sum / numbers.length,
    max: sorted[sorted.length - 1],
    min: sorted[0],
    p95: getPercentile(95),
    p99: getPercentile(99),
    jitter: numbers.length > 1 ? totalJitter / (numbers.length - 1) : 0,
  };
};
