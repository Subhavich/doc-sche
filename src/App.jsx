import EditingPage from "./EditPage";

import TablePage from "./TablePage";
import { useState } from "react";
import "./App.css";
import { generateMonthSlots, scheduleSlots } from "./utils/slotCreation";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

function App() {
  const [display, setDisplay] = useState(false);

  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: currentMonth },
    doctors: [
      {
        name: "Doctor 1",
        color: "violet",
        slots: [],
      },
      {
        name: "Doctor 2",
        color: "magenta",
        slots: [],
      },
      {
        name: "Doctor 3",
        color: "red",
        slots: [],
      },
      {
        name: "Doctor 4",
        color: "orange",
        slots: [],
      },
      {
        name: "Doctor 5",
        color: "purple",
        slots: [],
      },
      {
        name: "Doctor 6",
        color: "slategray",
        slots: [],
      },
      {
        name: "Doctor 7",
        color: "yellow",
        slots: [],
      },
      {
        name: "Doctor 8",
        color: "slateblue",
        slots: [],
      },
    ],
  });

  //this
  const doctors = config.doctors.map((doctor) => ({
    ...doctor,
    slots: doctor.slots.map((slot) => ({ ...slot })),
  }));
  //this
  const initialSlots = generateMonthSlots(
    config.scheduleStart.year,
    config.scheduleStart.month
  );

  scheduleSlots(doctors, initialSlots);

  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
  const immutableInitialSlots = deepCopy(initialSlots);
  const immutableDoctors = deepCopy(doctors);

  console.log(
    "Initial Data (After Scheduling):",
    immutableInitialSlots,
    immutableDoctors
  );

  return (
    <>
      <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
        Switch display
      </button>
      {display ? (
        <EditingPage config={config} setConfig={setConfig} />
      ) : (
        <TablePage
          initialSlots={immutableInitialSlots}
          doctors={immutableDoctors}
        />
      )}
    </>
  );
}

export default App;
