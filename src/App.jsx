import { useState } from "react";
import EditingPage from "./EditPage";

import TablePage from "./TablePage";

import "./App.css";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const createSlot = (date, startTime, duration, type, order) => {
  return {
    date,
    startTime,
    duration,
    t: (date.getDate() - 1) * 24 + startTime,
    type,
    order,
    id: date.getDate() + type + order,
    doctor: undefined,
  };
};

function App() {
  const [display, setDisplay] = useState(false);
  const [workHistory, setWorkHistory] = useState([]);
  const [appActive, setAppActive] = useState(false);

  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: currentMonth },
    doctors: [
      {
        name: "henn",
        color: "#ddd",
        slots: [
          createSlot(new Date(2024, 11, 12), 8, 2, "type1", 1),
          createSlot(new Date(2024, 11, 12), 10, 2, "type1", 2),
          createSlot(new Date(2024, 11, 12), 12, 2, "typeER", 3),
          createSlot(new Date(2024, 11, 12), 14, 2, "typeER", 4),
        ],
      },
      {
        name: "salisu",
        color: "blue",
        slots: [
          createSlot(new Date(2024, 11, 13), 8, 2, "type2", 1),
          createSlot(new Date(2024, 11, 13), 10, 2, "typeER", 2),
          createSlot(new Date(2024, 11, 13), 14, 2, "typeER", 3),
        ],
      },
      {
        name: "jacks",
        color: "slategray",
        slots: [
          createSlot(new Date(2024, 11, 14), 8, 2, "type3", 1),
          createSlot(new Date(2024, 11, 14), 10, 2, "type3", 2),
          createSlot(new Date(2024, 11, 14), 12, 2, "typeER", 3),
          createSlot(new Date(2024, 11, 14), 14, 2, "type3", 4),
          createSlot(new Date(2024, 11, 14), 16, 2, "typeER", 5),
        ],
      },
      {
        name: "will",
        color: "red",
        slots: [
          createSlot(new Date(2024, 11, 15), 8, 2, "typeER", 1),
          createSlot(new Date(2024, 11, 15), 10, 2, "type4", 2),
        ],
      },
    ],
  });

  const doctors = config.doctors.map((doctor) => {
    // return { ...doctor, slots: [] };
    return { ...doctor };
  });

  return (
    <>
      <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
        Switch display
      </button>
      {display ? (
        <EditingPage config={config} setConfig={setConfig} />
      ) : (
        <TablePage
          config={config}
          setConfig={setConfig}
          workHistory={workHistory}
          setWorkHistory={setWorkHistory}
          doctors={doctors}
        />
      )}
    </>
  );
}

export default App;
