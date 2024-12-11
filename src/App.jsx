import { useState } from "react";
import EditingPage from "./EditPage";
import TablePage from "./TablePage";

import "./App.css";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

function App() {
  const [display, setDisplay] = useState(false);
  const [workHistory, setWorkHistory] = useState([]);
  const [appActive, setAppActive] = useState(false);

  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: currentMonth },
    doctors: [
      { name: "henn", color: "#ddd", slots: ["a", "b", "c", "d"] },
      { name: "salisu", color: "blue", slots: ["a", "b", "d"] },
      { name: "jacks", color: "slategray", slots: ["a", "b", "c", "d", "e"] },
      { name: "will", color: "red", slots: ["a", "b"] },
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
