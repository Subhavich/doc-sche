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
import { MOCKDOCS, MOCKDOCSFULL } from "./utils/static";
import ReadOnlyTablePage from "./ReadOnlyTablePage";
import { hasUnassignedSlots } from "./utils/slotValidation";

// const currentYear = new Date().getFullYear();
// const currentMonth = new Date().getMonth();

const currentYear = new Date(2025, 3).getFullYear();
const currentMonth = new Date(2025, 3).getMonth();
function App() {
  logAllFromLocalStorage();

  // Check if the schedule has been generated before
  const [workHistory, setWorkHistory] = useState(() => {
    const savedWorkHistory = loadFromLocalStorage("workHistory");
    console.log("Loaded WorkHistory", savedWorkHistory);
    return savedWorkHistory || [];
  });

  const [activePage, setActivePage] = useState(() => {
    const savedCurrentPage = loadFromLocalStorage("currentPage");
    return savedCurrentPage || 0;
  });

  const [display, setDisplay] = useState(() => {
    const isGenerated = loadFromLocalStorage("isGenerated");
    return isGenerated ? "table" : "edit"; // If true, show TablePage; else EditingPage
  });

  const [tableSlots, setTableSlots] = useState(() => {
    const savedSlots = loadFromLocalStorage("tableSlots");
    console.log("Loaded Slots", savedSlots);
    return savedSlots;
  });

  const [tableDoctors, setTableDoctors] = useState(() => {
    const savedDoctors = loadFromLocalStorage("tableDoctors");
    return savedDoctors; // Use saved data or initial data
  });

  const [config, setConfig] = useState(() => {
    const savedConfig = loadFromLocalStorage("config");
    return (
      savedConfig || {
        scheduleStart: { year: currentYear, month: currentMonth },
        doctors: MOCKDOCSFULL,
      }
    );
  });

  //Display Components
  const [displayDoctors, setDisplayDoctors] = useState();
  const [displaySlots, setDisplaySlots] = useState();

  useEffect(() => {
    console.log("THIS TRIGGERS");
    setWorkHistory((prev) => {
      if (activePage !== workHistory.length - 1) {
        return prev;
      }

      if (!tableSlots || !tableDoctors) {
        return prev;
      }

      const latestMonth = prev[prev.length - 1];
      const theMonth = {
        ...latestMonth,
        slots: tableSlots,
        doctors: tableDoctors,
      };

      const newWorkHistoryArray = [...prev];
      newWorkHistoryArray.pop();

      return [...newWorkHistoryArray, theMonth];
    });

    if (activePage === workHistory.length - 1) {
      saveToLocalStorage("tableSlots", tableSlots);
      saveToLocalStorage("tableDoctors", tableDoctors);
    }
  }, [tableSlots, tableDoctors]);

  //SAVE CONFIG TO LOCALSTORAGE ON CONFIG CHANGES
  useEffect(() => {
    saveToLocalStorage("config", config);
  }, [config]);

  useEffect(() => {
    saveToLocalStorage("workHistory", workHistory);
  }, [workHistory]);

  const handleSelectPage = (page) => {
    if (page === workHistory.length - 1) {
      console.log("In the Present");
      setTableSlots(workHistory[page].slots);
      setTableDoctors(workHistory[page].doctors);
      setActivePage(page);
      return;
    }
    setActivePage(page);
    console.log("In the Past");
    console.log(workHistory[page]);

    setDisplaySlots(workHistory[page].slots);
    setDisplayDoctors(workHistory[page].doctors);
  };

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

    setTableSlots(updatedSlots);
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
    setActivePage(0);
    saveToLocalStorage("currentPage", 0);
    saveToLocalStorage("tableSlots", updatedSlots);
    saveToLocalStorage("tableDoctors", updatedDoctors);

    setDisplay("table");
  };

  const handleAddNewMonth = () => {
    const processedDoctors = config.doctors.map((doctor) => ({
      ...doctor,
      slots: doctor.slots.map((slot) => ({ ...slot })), // Deep copy slots
    }));

    const newMonth =
      config.scheduleStart.month >= 11
        ? 0
        : Number(config.scheduleStart.month) + 1;
    const newYear =
      config.scheduleStart.month >= 11
        ? Number(config.scheduleStart.year) + 1
        : config.scheduleStart.year;

    const generatedSlots = generateMonthSlots(newYear, newMonth);
    scheduleSlots(processedDoctors, generatedSlots);

    // Use deep copy to avoid mutating shared references
    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
    const updatedSlots = deepCopy(generatedSlots);
    const updatedDoctors = deepCopy(processedDoctors);

    const dateObject = {
      month: newMonth,
      year: newYear,
    };

    setWorkHistory((prev) => {
      // Append the new month's data first
      const updatedHistory = [
        ...prev,
        { date: dateObject, slots: updatedSlots, doctors: updatedDoctors },
      ];

      // Trim to the last 3 months, if necessary
      if (updatedHistory.length > 3) {
        updatedHistory.shift();
      }

      return updatedHistory;
    });

    setTableSlots(updatedSlots); // Update current state
    setTableDoctors(updatedDoctors);

    setConfig((prev) => ({
      ...prev,
      scheduleStart: { year: newYear, month: newMonth },
    }));

    const newPageIndex = Math.min(workHistory.length, 2); // Ensure index is valid after trimming
    setActivePage(newPageIndex); // Set to the new month
    saveToLocalStorage("currentPage", newPageIndex);
    saveToLocalStorage("tableSlots", updatedSlots);
    saveToLocalStorage("tableDoctors", updatedDoctors);
  };

  return (
    <div>
      <SwitchDispButton setDisplay={setDisplay} />
      <ClearStorageButton />
      {loadFromLocalStorage("isGenerated") && (
        <HistoryPagination
          handleAddNewMonth={handleAddNewMonth}
          workHistory={workHistory}
          tableSlots={tableSlots}
          handleSelectPage={handleSelectPage}
        />
      )}

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
          {activePage == workHistory.length - 1 && (
            <TablePage
              tableDoctors={tableDoctors}
              setTableDoctors={setTableDoctors}
              tableSlots={tableSlots}
              setTableSlots={setTableSlots}
              isGenerated={loadFromLocalStorage("isGenerated")}
            />
          )}
          {activePage < workHistory.length - 1 && (
            <>
              <p>read only</p>
              <ReadOnlyTablePage
                tableDoctors={displayDoctors}
                setTableDoctors={setDisplayDoctors}
                tableSlots={displaySlots}
                setTableSlots={setDisplaySlots}
                isGenerated={loadFromLocalStorage("isGenerated")}
              />
            </>
          )}
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
const HistoryPagination = ({
  workHistory,
  handleAddNewMonth,
  tableSlots,
  handleSelectPage,
}) => {
  return (
    <div>
      {workHistory.map((month, ind) => {
        return (
          <button key={ind} onClick={() => handleSelectPage(ind)}>
            {Number(month.date.month) + 1} - {month.date.year}
          </button>
        );
      })}
      <button
        onClick={() => {
          if (hasUnassignedSlots(tableSlots)) {
            console.log("still has unassigned slots");
            return;
          }
          handleAddNewMonth();
        }}
      >
        +
      </button>
    </div>
  );
};
