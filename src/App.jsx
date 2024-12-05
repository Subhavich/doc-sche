import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState(true);
  return (
    <>
      <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
        Switch display
      </button>
      {display ? <EditingPage /> : <TablePage />}
    </>
  );
}

export default App;

// Editing Page

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function EditingPage() {
  const currentYear = new Date().getFullYear();
  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: months[0] },
    doctors: [],
  });

  const handleMonthChange = (e) => {
    setConfig((pv) => {
      const newMonthValue = e.target.value;
      return {
        ...pv,
        scheduleStart: { ...pv.scheduleStart, month: newMonthValue },
      };
    });
  };

  const handleYearChange = (e) => {
    setConfig((pv) => {
      const newYearValue = e.target.value;
      return {
        ...pv,
        scheduleStart: { ...pv.scheduleStart, year: newYearValue },
      };
    });
  };
  return (
    <>
      <p>logger</p>
      <p>{config.scheduleStart.month}</p> <p>{config.scheduleStart.year}</p>
      <hr />
      <p>editing page</p>
      <p>Select Starting Month</p>
      {/* Year Input */}
      <input
        type="number"
        min="1900"
        max="2100"
        value={config.scheduleStart.year}
        onChange={handleYearChange}
      />
      {/* Month Dropdown */}
      <select value={config.scheduleStart.month} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </>
  );
}

export function TablePage() {
  return <p>table page</p>;
}
