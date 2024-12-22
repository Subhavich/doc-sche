import EditingPage from "./EditPage";
import TablePage from "./TablePage";

import { useState, useEffect } from "react";
import "./App.css";
import { generateMonthSlots, scheduleSlots } from "./utils/slotCreation";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  logAllFromLocalStorage,
} from "./utils/localStorage";
import { MOCKDOCS, MOCKDOCSFULL } from "./utils/static";
import ReadOnlyTablePage from "./ReadOnlyTablePage";
import { calculateAccumulatedCost } from "./utils/derivingValues";
import {
  ClearStorageButton,
  SwitchDispButton,
  GenerateTableButton,
  HistoryPagination,
  UseMockDoctorsButton,
  Bar,
} from "./AppComponents";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const startingDoctors = [];
//[],MOCKDOCSFULL,MOCKDOCS
logAllFromLocalStorage();

function App() {
  const [workHistory, setWorkHistory] = useState(() => {
    const savedWorkHistory = loadFromLocalStorage("workHistory");
    return savedWorkHistory || [];
  });

  const [activePage, setActivePage] = useState(() => {
    const savedCurrentPage = loadFromLocalStorage("currentPage");
    return savedCurrentPage || 0;
  });

  const [display, setDisplay] = useState(() => {
    const isGenerated = loadFromLocalStorage("isGenerated");
    return isGenerated ? "table" : "edit";
  });

  const [tableSlots, setTableSlots] = useState(() => {
    const savedSlots = loadFromLocalStorage("tableSlots");
    return savedSlots;
  });

  const [tableDoctors, setTableDoctors] = useState(() => {
    const savedDoctors = loadFromLocalStorage("tableDoctors");
    return savedDoctors;
  });

  const [config, setConfig] = useState(() => {
    const savedConfig = loadFromLocalStorage("config");
    return (
      savedConfig || {
        scheduleStart: { year: currentYear, month: currentMonth },
        doctors: startingDoctors,
      }
    );
  });

  //Display Components
  const [displayDoctors, setDisplayDoctors] = useState();
  const [displaySlots, setDisplaySlots] = useState();

  //Save most recent changes to localStorage's History
  useEffect(() => {
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

  //Save config changes to localStorage's Config
  useEffect(() => {
    saveToLocalStorage("config", config);
  }, [config]);

  //Save workHistory to localStoage on change
  useEffect(() => {
    saveToLocalStorage("workHistory", workHistory);
  }, [workHistory]);

  //Generate First Time
  const handleGenerateSchedule = () => {
    // COPY doctor from config/ Add slots
    const processedDoctors = config.doctors.map((doctor) => {
      return {
        ...doctor,
        slots: [],
      };
    });
    // NEED TO INCLUDE DR ACCUMULATED IN GENERATION PROCESS
    const generatedSlots = generateMonthSlots(
      config.scheduleStart.year,
      config.scheduleStart.month
    );

    scheduleSlots(processedDoctors, generatedSlots);

    // Use the values directly to update states
    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
    const updatedSlots = deepCopy(generatedSlots);
    let updatedDoctors = deepCopy(processedDoctors);

    updatedDoctors = updatedDoctors.map((doctor) => ({
      ...doctor,
      quota: calculateAccumulatedCost(doctor.name, updatedSlots),
    }));

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

  //Generate New Month
  const handleAddNewMonth = () => {
    const processedDoctors = [
      ...tableDoctors.map((doctor) => ({
        ...doctor,
        lastMonthAdv: doctor.quota,
        slots: [],
      })),
    ];

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
    let updatedDoctors = deepCopy(processedDoctors);

    updatedDoctors = updatedDoctors.map((doctor) => ({
      ...doctor,
      quota: calculateAccumulatedCost(doctor.name, updatedSlots),
    }));

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
    window.location.reload();
  };

  //Select Page of workHistory
  const handleSelectPage = (page) => {
    if (page === workHistory.length - 1) {
      setTableSlots(workHistory[page].slots);
      setTableDoctors(workHistory[page].doctors);
      setActivePage(page);
      return;
    }
    setActivePage(page);
    setDisplaySlots(workHistory[page].slots);
    setDisplayDoctors(workHistory[page].doctors);
  };

  return (
    <div className=" max-w-screen-lg mx-auto">
      <Bar>
        {!loadFromLocalStorage("isGenerated") && (
          <UseMockDoctorsButton config={config} setConfig={setConfig} />
        )}

        <SwitchDispButton display={display} setDisplay={setDisplay} />
        <ClearStorageButton />
      </Bar>
      {loadFromLocalStorage("isGenerated") && display === "table" && (
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
            handleGenerateSchedule={handleGenerateSchedule}
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
              workHistory={workHistory}
            />
          )}
          {activePage < workHistory.length - 1 && (
            <>
              <p>READ ONLY TABLE</p>
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
