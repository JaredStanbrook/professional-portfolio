// worker/lib/grades.ts
//
// The grade calculator's arithmetic. Marks and weights are percentages; a
// row with a weight but no mark is still to come.

export interface Assessment {
  mark: string;
  weight: string;
}

const pct = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : NaN;
};

export function gradeStats(rows: Assessment[], expectedRaw: string) {
  let completedWeight = 0;
  let weightedSum = 0;
  let remainingWeight = 0;

  for (const row of rows) {
    const weight = pct(row.weight);
    if (!(weight > 0)) continue;
    const mark = pct(row.mark);
    if (Number.isNaN(mark)) remainingWeight += weight;
    else {
      weightedSum += mark * (weight / 100);
      completedWeight += weight;
    }
  }

  const expected = pct(expectedRaw);
  const currentAverage = completedWeight > 0 ? weightedSum / (completedWeight / 100) : 0;
  let required: number | null = null;
  let message = "Enter your marks and weights, then a target, to see what you need.";

  if (expected > 0 && remainingWeight > 0) {
    required = (expected - weightedSum) / (remainingWeight / 100);
    const rest = `on the remaining ${remainingWeight}% to reach ${expected}%.`;
    if (required <= 0) message = "Goal achieved: you already have enough to reach your target.";
    else if (required > 100)
      message = `You would need ${required.toFixed(2)}% ${rest} That is out of reach.`;
    else message = `You need an average of ${required.toFixed(2)}% ${rest}`;
  } else if (completedWeight > 0) {
    message =
      completedWeight >= 100
        ? `Everything is marked. Your final average is ${currentAverage.toFixed(2)}%.`
        : `Your average so far is ${currentAverage.toFixed(2)}%.`;
  }

  return {
    currentAverage,
    completedWeight,
    remainingWeight,
    totalWeight: completedWeight + remainingWeight,
    required,
    message,
  };
}
