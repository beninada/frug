import { useState } from "react";
// import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface GrowthTableCell {
  name: number;
  value: number;
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const tickFormatter = (value: number) => {
  if (value > 1000000000) {
    return `$${(value / 1000000000).toString()}B`;
  } else if (value > 1000000) {
    return `$${(value / 1000000).toString()}M`;
  } else if (value > 10000) {
    return `$${(value / 1000).toString()}K`;
  } else {
    return `$${value.toString()}`;
  }
};

function App() {
  const [income, setIncome] = useState<number>(154000);
  const [percentageSavedAnnually, setPercentageSavedAnnually] =
    useState<number>(7);
  const [amountSavedAlready, setAmountSavedAlready] = useState<number>(60000);
  const [percentageExpectedAnnualReturn, setPercentageExpectedAnnualReturn] =
    useState<number>(5);
  const [growthTable, setGrowthTable] = useState<Array<GrowthTableCell>>([
    {
      name: 30,
      value: 0,
    },
  ]);
  const [
    percentageIncomeRequiredAtRetirement,
    setPercentageIncomeRequiredAtRetirement,
  ] = useState<number>(60);

  console.log(percentageExpectedAnnualReturn);

  const currentAge = 30;
  const ageAtRetirement = 67;
  const incomeRequiredAtRetirement =
    income * percentageIncomeRequiredAtRetirement * 0.01;
  const totalYearsOfRetirement = 30;
  const amountSavedAnnually = income * percentageSavedAnnually * 0.01;
  const percentageInflation = 4;

  const computeIncomeRequiredForCurrentYear = (
    ageAtRetirement: number,
    currentAge: number,
    firstYearIncomeRequiredAtRetirement: number
  ): number => {
    const multiplier = 0.03;
    const isFirstYear = currentAge - ageAtRetirement === 0;
    let incomeRequiredForCurrentAge;

    if (isFirstYear) {
      incomeRequiredForCurrentAge = firstYearIncomeRequiredAtRetirement;
    } else {
      incomeRequiredForCurrentAge =
        firstYearIncomeRequiredAtRetirement +
        firstYearIncomeRequiredAtRetirement *
          (currentAge - ageAtRetirement) *
          multiplier;
    }

    return incomeRequiredForCurrentAge;
  };

  const calculate = (): void => {
    let i = 0;
    let age = currentAge;
    let amount = income + amountSavedAlready;

    // Compute growth
    while (age < ageAtRetirement) {
      amount =
        amount +
        amountSavedAnnually +
        amount * percentageExpectedAnnualReturn * 0.01;

      growthTable[i] = {
        name: age,
        value: amount,
      };

      age++;
      i++;
    }

    // Compute usage in retirement
    while (age < ageAtRetirement + totalYearsOfRetirement) {
      // Add back growth of funds for this year
      amount += amount * percentageExpectedAnnualReturn * 0.01;

      amount -= computeIncomeRequiredForCurrentYear(
        ageAtRetirement,
        age,
        incomeRequiredAtRetirement
      );

      amount -= amount * percentageInflation * 0.01;

      growthTable[i] = {
        name: age,
        value: amount,
      };

      age++;
      i++;
    }

    setGrowthTable([...growthTable]);
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Income</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(parseFloat(e.target.value))}
        />

        <label>Percentage saved annually</label>
        <input
          type="number"
          value={percentageSavedAnnually}
          onChange={(e) =>
            setPercentageSavedAnnually(parseFloat(e.target.value))
          }
        />

        <label>Amount saved already</label>
        <input
          type="number"
          value={amountSavedAlready}
          onChange={(e) => setAmountSavedAlready(parseFloat(e.target.value))}
        />

        <label>Percentage income required at retirement</label>
        <input
          type="number"
          value={percentageIncomeRequiredAtRetirement}
          onChange={(e) =>
            setPercentageIncomeRequiredAtRetirement(parseFloat(e.target.value))
          }
        />

        <label>Expected annual return on investments</label>
        <input
          type="number"
          value={percentageExpectedAnnualReturn}
          onChange={(e) =>
            setPercentageExpectedAnnualReturn(parseFloat(e.target.value))
          }
        />

        <button onClick={calculate}>Calculate</button>
      </div>

      <div>
        <LineChart width={400} height={400} data={growthTable}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value: number) => usdFormatter.format(value)} />
          <Legend />
          <XAxis dataKey="name" label="Age" />
          <YAxis
            dataKey="value"
            label="Savings"
            tickFormatter={tickFormatter}
          />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>

        <table>
          <tbody>
            {growthTable.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{usdFormatter.format(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
