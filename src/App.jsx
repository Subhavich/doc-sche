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
  // Check if the schedule has been generated before
  const [display, setDisplay] = useState(() => {
    const isGenerated = loadFromLocalStorage("isGenerated");
    return isGenerated ? false : true; // If true, show TablePage; else EditingPage
  });

  const [initialSlots, setInitialSlots] = useState(null); // Hold slots until button press
  const [doctors, setDoctors] = useState(null); // Hold doctors until button press

  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: currentMonth },
    doctors: MOCKDOCS,
  });

  const handleGenerateSchedule = () => {
    // Generate slots and doctors when button is pressed
    const processedDoctors = config.doctors.map((doctor) => ({
      ...doctor,
      slots: doctor.slots.map((slot) => ({ ...slot })),
    }));

    const generatedSlots = generateMonthSlots(
      config.scheduleStart.year,
      config.scheduleStart.month
    );

    scheduleSlots(processedDoctors, generatedSlots);

    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
    setInitialSlots(deepCopy(generatedSlots));
    setDoctors(deepCopy(processedDoctors));

    // Save "isGenerated" to localStorage and change display to TablePage
    saveToLocalStorage("isGenerated", true);
    setDisplay(false);
  };

  useEffect(() => {
    console.log(
      "App initialized. Current state of 'isGenerated':",
      loadFromLocalStorage("isGenerated")
    );
  }, []);

  return (
    <div>
      <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
        Switch display
      </button>
      <button
        onClick={() => {
          clearLocalStorage(["tableSlots", "tableDoctors", "isGenerated"]);
          console.log("Local storage cleared.");
        }}
      >
        Clear Local
      </button>
      {display ? (
        <EditingPage config={config} setConfig={setConfig} />
      ) : (
        <TablePage initialSlots={initialSlots} doctors={doctors} />
      )}
      {/* Button to generate schedule and switch display */}
      {display && (
        <button onClick={handleGenerateSchedule}>
          Generate Schedule and View Table
        </button>
      )}
    </div>
  );
}

export default App;
