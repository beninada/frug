interface GrowthTableCell {
  name: number;
  value: number;
}

const calculateIncomeRequiredForCurrentYear = (
  ageAtRetirement: number,
  currentAge: number,
  firstYearIncomeRequiredAtRetirement: number,
  percentageExpectedRetirementExpensesGrowth: number
): number => {
  const isFirstYear = currentAge - ageAtRetirement === 0;
  let incomeRequiredForCurrentAge;

  if (isFirstYear) {
    incomeRequiredForCurrentAge = firstYearIncomeRequiredAtRetirement;
  } else {
    incomeRequiredForCurrentAge =
      firstYearIncomeRequiredAtRetirement +
      firstYearIncomeRequiredAtRetirement *
        (currentAge - ageAtRetirement) *
        percentageExpectedRetirementExpensesGrowth *
        0.01;
  }

  return incomeRequiredForCurrentAge;
};

export const calculateGrowthTable = (
  currentAge: number,
  retirementAge: number,
  totalYearsOfRetirement: number,
  income: number,
  percentageSavedAnnually: number,
  incomeRequiredAtRetirement: number,
  amountSavedAlready: number,
  percentageExpectedAnnualReturn: number,
  percentageInflation: number,
  percentageExpectedRetirementExpensesGrowth: number
): Array<GrowthTableCell> => {
  const table = [];
  let i = 0;
  let age = currentAge;
  let amount = income + amountSavedAlready;
  const amountSavedAnnually = income * percentageSavedAnnually * 0.01;

  // Compute growth
  while (age < retirementAge) {
    amount =
      amount +
      amountSavedAnnually +
      amount * percentageExpectedAnnualReturn * 0.01;

    table[i] = {
      name: age,
      value: amount,
    };

    age++;
    i++;
  }

  // Compute usage in retirement
  while (age < retirementAge + totalYearsOfRetirement) {
    amount -= calculateIncomeRequiredForCurrentYear(
      retirementAge,
      age,
      incomeRequiredAtRetirement,
      percentageExpectedRetirementExpensesGrowth
    );

    // Account for inflation
    amount -= amount * percentageInflation * 0.01;

    // Add back growth of funds for this year
    amount += amount * percentageExpectedAnnualReturn * 0.01;

    table[i] = {
      name: age,
      value: amount,
    };

    age++;
    i++;
  }

  return table;
};
