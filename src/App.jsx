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
        color: "violet",
        slots: [],
      },
      {
        name: "salisu",
        color: "blue",
        slots: [],
      },
      {
        name: "jacks",
        color: "slategray",
        slots: [],
      },
      {
        name: "will",
        color: "red",
        slots: [],
      },
      {
        name: "henns",
        color: "violet",
        slots: [],
      },
      {
        name: "salisus",
        color: "blue",
        slots: [],
      },
      {
        name: "jackss",
        color: "slategray",
        slots: [],
      },
      {
        name: "wills",
        color: "red",
        slots: [],
      },
      {
        name: "jax",
        color: "slategray",
        slots: [],
      },
      {
        name: "rreed",
        color: "red",
        slots: [],
      },
      {
        name: "numb",
        color: "red",
        slots: [],
      },
      {
        name: "canfeel",
        color: "red",
        slots: [],
      },
      {
        name: "kite",
        color: "red",
        slots: [],
      },
      {
        name: "muvluv",
        color: "red",
        slots: [],
      },
    ],
  });

  // const doctors = config.doctors.map((doctor) => {
  //   // return { ...doctor, slots: [] };
  //   return { ...doctor };
  // });

  const doctors = config.doctors.map((doctor) => ({
    ...doctor,
    slots: doctor.slots.map((slot) => ({ ...slot })),
  }));

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
