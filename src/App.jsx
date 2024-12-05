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
  const [config, setConfig] = useState();

  const getDaysInMonth = (month, year) => {
    const monthIndex = months.indexOf(month); // Get the month index (0-11)
    return new Date(year, monthIndex + 1, 0).getDate(); // Calculate days in the month
  };

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [days, setDays] = useState(getDaysInMonth(months[0], currentYear));

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10) || currentYear;
    setSelectedYear(year);
    setDays(getDaysInMonth(selectedMonth, year));
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    setDays(getDaysInMonth(month, selectedYear));
  };

  return (
    <>
      <p>editing page</p>

      {/* Year Input */}
      <input
        type="number"
        value={selectedYear}
        onChange={handleYearChange}
        min="1900"
        max="2100"
        placeholder="Year"
        className="p-2 border rounded"
      />

      {/* Month Dropdown */}
      <select
        onChange={handleMonthChange}
        value={selectedMonth}
        className="p-2 border rounded ml-2"
      >
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Day Dropdown */}
      <select className="p-2 border rounded ml-2">
        {Array.from({ length: days }, (_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
    </>
  );
}

export function TablePage() {
  return <p>table page</p>;
}
