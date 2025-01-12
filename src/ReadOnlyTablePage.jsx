import { useState, useEffect, useRef } from "react";
import { Pagination, ReadOnlyTBody, THead } from "./TableComponents";
import { deriveWeeks } from "./utils/rendering";
import { Summary, SuperSummary } from "./SummaryComponents";
import html2canvas from "html2canvas";
import { useAuth } from "./store/AuthContext";

export default function ReadOnlyTablePage({
  tableSlots,
  tableDoctors,
  isGenerated,
}) {
  const { isAuthenticated, authenticate } = useAuth();

  if (!isGenerated) {
    return <p>Please Gen Schedule First</p>;
  }

  if (!tableDoctors || !tableSlots) {
    return <p>No Data Yet</p>;
  }

  const [selectedDoctor, setSelectedDoctor] = useState();

  const handleSelectDoctor = (load) => {
    setSelectedDoctor(load);
  };

  return (
    <>
      <Table
        doctors={tableDoctors}
        slots={tableSlots}
        handleSelectDoctor={handleSelectDoctor}
      />
      <Summary
        selectedDoctor={selectedDoctor}
        slots={tableSlots}
        doctors={tableDoctors}
      />
      <div className="my-6 flex flex-col items-center space-y-2">
        <button
          className=" w-fit  border border-zinc-600 rounded p-2"
          onClick={() => authenticate(111000)}
        >
          Toggle View All
        </button>
        {isAuthenticated && (
          <SuperSummary doctors={tableDoctors} slots={tableSlots} />
        )}
      </div>
    </>
  );
}

const Table = ({ slots, doctors, handleSelectDoctor }) => {
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState("default");
  const [currentWeek, setCurrentWeek] = useState(deriveWeeks(slots)[page]);

  const divRef = useRef();

  const handleCapture = () => {
    if (!divRef.current) return;

    html2canvas(divRef.current, {
      scale: 1,
      useCORS: true,
      backgroundColor: "white",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "screenshot.png";
      link.click();
    });
  };

  useEffect(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    const weeks = deriveWeeks(slots); // Derive weeks from the latest slots
    if (weeks[page]) {
      setCurrentWeek(weeks[page]); // Update the current week for the current page
    } else if (weeks.length > 0) {
      // If the page is out of bounds (e.g., after slots change), reset to the first week
      setPage(0);
      setCurrentWeek(weeks[0]);
    } else {
      setCurrentWeek([]); // Default to an empty array if no weeks
    }
  }, [slots, page]);

  return (
    <>
      <div className="mb-8 flex justify-center space-x-2">
        <button
          className="text-xl font-semi text-blue-700 border-2 border-blue-700 px-4 py-2 rounded"
          onClick={() =>
            setMode((prev) => (prev === "all" ? "default" : "all"))
          }
        >
          {mode === "default" ? "Show All Weeks" : "Show One Week"}
        </button>
        {mode === "all" && (
          <button
            className="text-xl font-semi text-lime-600 border-2 border-lime-600 px-4 py-2 rounded"
            onClick={handleCapture}
          >
            Download This Schedule
          </button>
        )}
      </div>
      {mode === "default" && (
        <>
          {" "}
          <Pagination
            pages={deriveWeeks(slots).length}
            setPage={setPage}
            page={page}
          />
          <p className="text-center py-4 mb-4 text-xl">
            Year : {new Date(slots[0].date).getFullYear()} - Month :{" "}
            {new Date(slots[0].date).getMonth() + 1}
          </p>
          <table className="bg-white border-collapse">
            <THead currentWeek={currentWeek} />
            <ReadOnlyTBody
              slots={slots}
              doctors={doctors}
              page={page}
              setPage={setPage}
              currentWeek={currentWeek}
              handleSelectDoctor={handleSelectDoctor}
            />
          </table>
        </>
      )}
      {mode === "all" && (
        <div ref={divRef} className="flex flex-col space-y-12 ">
          <p className="text-center py-4 mb-4 text-xl">
            Year : {new Date(slots[0].date).getFullYear()} - Month :{" "}
            {new Date(slots[0].date).getMonth() + 1}
          </p>
          {deriveWeeks(slots).map((week, ind) => (
            <table key={ind} className="bg-white border-collapse">
              <THead currentWeek={deriveWeeks(slots)[ind]} />
              <ReadOnlyTBody
                slots={slots}
                doctors={doctors}
                handleSelectDoctor={handleSelectDoctor}
                currentWeek={deriveWeeks(slots)[ind]}
              />
            </table>
          ))}
        </div>
      )}
    </>
  );
};
