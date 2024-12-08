import { useRef, useState, useEffect } from "react";
import EditingPage from "./EditPage";

import "./App.css";

function App() {
  const [display, setDisplay] = useState(true);
  return (
    <>
      <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
        Switch display
      </button>
      {display ? <EditingPage /> : <TablePage />}
    </>
  );
}

export default App;

export function TablePage() {
  return <p>table page</p>;
}
