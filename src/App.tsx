import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import * as calculations from "./util/calculations";
import * as formatters from "./util/formatters";
import { GrowthTableCell } from "./types";

function App() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(67);
  const [totalYearsOfRetirement, setTotalYearsOfRetirement] =
    useState<number>(30);
  const [percentageInflation, setPercentageInflation] = useState<number>(4);
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

  const calculate = (): void => {
    const table = calculations.calculateGrowthTable(
      currentAge,
      retirementAge,
      totalYearsOfRetirement,
      income,
      percentageSavedAnnually,
      percentageIncomeRequiredAtRetirement,
      amountSavedAlready,
      percentageExpectedAnnualReturn,
      percentageInflation
    );

    setGrowthTable([...table]);
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
        <label>Current Age</label>
        <input
          type="number"
          value={currentAge}
          onChange={(e) => setCurrentAge(parseFloat(e.target.value))}
        />

        <label>Retirement Age</label>
        <input
          type="number"
          value={retirementAge}
          onChange={(e) => setRetirementAge(parseFloat(e.target.value))}
        />

        <label>Total Years of Retirement</label>
        <input
          type="number"
          value={totalYearsOfRetirement}
          onChange={(e) =>
            setTotalYearsOfRetirement(parseFloat(e.target.value))
          }
        />

        <label>Income</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(parseFloat(e.target.value))}
        />

        <label>Percentage of Income Saved Annually</label>
        <input
          type="number"
          value={percentageSavedAnnually}
          onChange={(e) =>
            setPercentageSavedAnnually(parseFloat(e.target.value))
          }
        />

        <label>Current Amount Saved</label>
        <input
          type="number"
          value={amountSavedAlready}
          onChange={(e) => setAmountSavedAlready(parseFloat(e.target.value))}
        />

        <label>Percentage of Income Required at Retirement</label>
        <input
          type="number"
          value={percentageIncomeRequiredAtRetirement}
          onChange={(e) =>
            setPercentageIncomeRequiredAtRetirement(parseFloat(e.target.value))
          }
        />

        <label>Expected Annual Return on Investments</label>
        <input
          type="number"
          value={percentageExpectedAnnualReturn}
          onChange={(e) =>
            setPercentageExpectedAnnualReturn(parseFloat(e.target.value))
          }
        />

        <label>Expected Rate of Inflation</label>
        <input
          type="number"
          value={percentageInflation}
          onChange={(e) => setPercentageInflation(parseFloat(e.target.value))}
        />

        <button onClick={calculate}>Calculate</button>
      </div>

      <div>
        <LineChart width={400} height={400} data={growthTable}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value: number) => formatters.usdFormatter.format(value)}
          />
          <Legend />
          <XAxis dataKey="name" />
          <YAxis
            dataKey="value"
            tickFormatter={formatters.tickFormatter}
            unit="$"
          />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>

        <table>
          <tbody>
            {growthTable.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{formatters.usdFormatter.format(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;
