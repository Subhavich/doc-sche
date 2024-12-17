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

  const [initialSlots, setInitialSlots] = useState(null);
  const [doctors, setDoctors] = useState(null);

  const [tableSlots, setTableSlots] = useState(() => {
    const savedSlots = loadFromLocalStorage("tableSlots");
    return savedSlots || initialSlots; // Use saved data or initial data
  });

  const [tableDoctors, setTableDoctors] = useState(() => {
    const savedDoctors = loadFromLocalStorage("tableDoctors");
    return savedDoctors || doctors; // Use saved data or initial data
  });

  const [config, setConfig] = useState(() => {
    const savedConfig = loadFromLocalStorage("config");
    return (
      savedConfig || {
        scheduleStart: { year: currentYear, month: currentMonth },
        doctors: MOCKDOCS,
      }
    );
  });

  useEffect(() => {
    console.log("Change Detected");
    saveToLocalStorage("config", config);
  }, [config]);

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

    // Use the values directly to update states
    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
    const updatedSlots = deepCopy(generatedSlots);
    const updatedDoctors = deepCopy(processedDoctors);

    setInitialSlots(updatedSlots);
    setDoctors(updatedDoctors);
    setTableSlots(updatedSlots); // Directly use updated values
    setTableDoctors(updatedDoctors);

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
      <button
        onClick={() => {
          setDisplay((prev) => !prev);
        }}
      >
        Switch display
      </button>
      <button
        onClick={() => {
          clearLocalStorage([
            "tableSlots",
            "tableDoctors",
            "isGenerated",
            "config",
          ]);
          console.log("Local storage cleared.");
        }}
      >
        Clear Local
      </button>
      {display ? (
        <EditingPage
          config={config}
          setConfig={setConfig}
          isGenerated={loadFromLocalStorage("isGenerated")}
        />
      ) : (
        <TablePage
          tableDoctors={tableDoctors}
          setTableDoctors={setTableDoctors}
          tableSlots={tableSlots}
          setTableSlots={setTableSlots}
          isGenerated={loadFromLocalStorage("isGenerated")}
        />
      )}
      {/* Button to generate schedule and switch display */}
      {display && !loadFromLocalStorage("isGenerated") && (
        <button onClick={handleGenerateSchedule}>
          Generate Schedule and View Table
        </button>
      )}
      {loadFromLocalStorage("isGenerated") && (
        <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
          Switch Page
        </button>
      )}
    </div>
  );
}

export default App;
