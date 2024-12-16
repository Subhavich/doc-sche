import EditingPage from "./EditPage";
import TablePage from "./TablePage";
import { useState, useEffect } from "react";
import "./App.css";
import { generateMonthSlots, scheduleSlots } from "./utils/slotCreation";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
} from "./utils/localStorage";
import { MOCKDOCS } from "./utils/static";
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

function App() {
  const [display, setDisplay] = useState(false);

  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: currentMonth },
    doctors: MOCKDOCS,
  });

  // Call clearLocalStorage whenever config changes
  useEffect(() => {
    console.log("Config changed, clearing localStorage...");
    clearLocalStorage(["tableSlots", "tableDoctors"]);
  }, [config]); // Dependency array ensures this runs only when `config` changes

  const doctors = config.doctors.map((doctor) => ({
    ...doctor,
    slots: doctor.slots.map((slot) => ({ ...slot })),
  }));

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
