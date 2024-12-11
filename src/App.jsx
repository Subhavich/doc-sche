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
    doctors: [],
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
        />
      )}
    </>
  );
}

export default App;
