import EditingPage from "./EditPage";
import TablePage from "./TablePage";

import { useState, useEffect } from "react";
import "./App.css";
import { generateMonthSlots, scheduleSlots } from "./utils/slotCreation";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
  logAllFromLocalStorage,
} from "./utils/localStorage";
import { MOCKDOCS } from "./utils/static";
import ReadOnlyTablePage from "./ReadOnlyTablePage";
import { hasUnassignedSlots } from "./utils/slotValidation";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

function App() {
  logAllFromLocalStorage();

  // Check if the schedule has been generated before
  const [workHistory, setWorkHistory] = useState(() => {
    const savedWorkHistory = loadFromLocalStorage("workHistory");
    console.log("SAVED WORK HIS", savedWorkHistory);
    return savedWorkHistory || [];
  });

  const [display, setDisplay] = useState(() => {
    const isGenerated = loadFromLocalStorage("isGenerated");
    return isGenerated ? "table" : "edit"; // If true, show TablePage; else EditingPage
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

  //SAVE CONFIG TO LOCALSTORAGE ON CONFIG CHANGES
  useEffect(() => {
    console.log("Change Detected");
    saveToLocalStorage("config", config);
  }, [config]);

  useEffect(() => {
    saveToLocalStorage("workHistory", workHistory);
  }, [workHistory]);

  const handleGenerateSchedule = () => {
    // Generate slots and doctors when button is pressed
    const processedDoctors = config.doctors.map((doctor) => ({
      ...doctor,
      slots: doctor.slots.map((slot) => ({ ...slot })),
    }));
    // NEED TO INCLUDE DR ACCUMULATED IN GENERATION PROCESS
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

    const dateObject = {
      month: config.scheduleStart.month,
      year: config.scheduleStart.year,
    };

    setWorkHistory((prev) => {
      console.log("Save Work History", [
        ...prev,
        { date: dateObject, slots: updatedSlots, doctors: updatedDoctors },
      ]);
      return [
        ...prev,
        { date: dateObject, slots: updatedSlots, doctors: updatedDoctors },
      ];
    });
    // Save "isGenerated" to localStorage and change display to TablePage
    saveToLocalStorage("isGenerated", true);

    setDisplay("table");
  };

  //CHECK IF GENERATED STATUS FROM LOCALSTORAGE
  useEffect(() => {
    console.log(
      "App initialized. Current state of 'isGenerated':",
      loadFromLocalStorage("isGenerated")
    );
  }, []);

  return (
    <div>
      <SwitchDispButton setDisplay={setDisplay} />
      <ClearStorageButton />
      <div>
        {workHistory.map((month) => {
          return (
            <button>
              {month.date.month} - {month.date.year}
            </button>
          );
        })}
        <button
          onClick={() => {
            if (hasUnassignedSlots(tableSlots)) {
              console.log("still has unassigned slots");
              return;
            }
          }}
        >
          {" "}
          +{" "}
        </button>
      </div>

      {display === "edit" && (
        <>
          <EditingPage
            config={config}
            setConfig={setConfig}
            isGenerated={loadFromLocalStorage("isGenerated")}
            setTableDoctors={setTableDoctors}
            setTableSlots={setTableSlots}
            tableDoctors={tableDoctors}
            tableSlots={tableSlots}
          />
          <GenerateTableButton
            handleGenerateSchedule={handleGenerateSchedule}
          />
        </>
      )}

      {display === "table" && (
        <>
          <TablePage
            tableDoctors={tableDoctors}
            setTableDoctors={setTableDoctors}
            tableSlots={tableSlots}
            setTableSlots={setTableSlots}
            isGenerated={loadFromLocalStorage("isGenerated")}
          />
          <ReadOnlyTablePage
            tableDoctors={tableDoctors}
            setTableDoctors={setTableDoctors}
            tableSlots={tableSlots}
            setTableSlots={setTableSlots}
            isGenerated={loadFromLocalStorage("isGenerated")}
          />
        </>
      )}
    </div>
  );
}

export default App;

const ClearStorageButton = () => {
  return (
    <button
      onClick={() => {
        clearLocalStorage([
          "tableSlots",
          "tableDoctors",
          "isGenerated",
          "config",
          "workHistory",
        ]);
        console.log("Local storage cleared.");
        window.location.reload();
      }}
    >
      Clear Local
    </button>
  );
};
const SwitchDispButton = ({ setDisplay }) => {
  return (
    <button
      onClick={() => {
        setDisplay((prev) => (prev === "table" ? "edit" : "table"));
      }}
    >
      Switch display
    </button>
  );
};
const GenerateTableButton = ({ handleGenerateSchedule }) => {
  return (
    <>
      {!loadFromLocalStorage("isGenerated") && (
        <button onClick={handleGenerateSchedule}>
          Generate Schedule and View Table
        </button>
      )}
    </>
  );
};
