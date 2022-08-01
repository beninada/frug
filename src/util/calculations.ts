import { GrowthTableCell } from "../types";

const calculateIncomeRequiredForCurrentYear = (
  ageAtRetirement: number,
  currentAge: number,
  firstYearIncomeRequiredAtRetirement: number,
  percentageInflation: number
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
        (percentageInflation * 0.01);
  }

  return incomeRequiredForCurrentAge;
};

export const calculateGrowthTable = (
  currentAge: number,
  retirementAge: number,
  totalYearsOfRetirement: number,
  income: number,
  percentageSavedAnnually: number,
  percentageIncomeRequiredAtRetirement: number,
  amountSavedAlready: number,
  percentageExpectedAnnualReturn: number,
  percentageInflation: number
): Array<GrowthTableCell> => {
  const table = [];
  let i = 0;
  let age = currentAge + 1;
  let amount = amountSavedAlready;
  const incomeRequiredAtRetirement =
    income * percentageIncomeRequiredAtRetirement * 0.01;
  const amountSavedAnnually = income * percentageSavedAnnually * 0.01;

  // Compute growth
  while (age < retirementAge) {
    amount +=
      amountSavedAnnually + amount * percentageExpectedAnnualReturn * 0.01;

    table[i] = {
      name: age,
      value: amount,
    };

    age++;
    i++;
  }

  // Compute usage in retirement
  while (age < retirementAge + totalYearsOfRetirement) {
    // Add back growth of funds for this year
    amount += amount * percentageExpectedAnnualReturn * 0.01;

    amount -= calculateIncomeRequiredForCurrentYear(
      retirementAge,
      age,
      incomeRequiredAtRetirement,
      percentageInflation
    );

    table[i] = {
      name: age,
      value: amount,
    };

    age++;
    i++;
  }

  return table;
};
