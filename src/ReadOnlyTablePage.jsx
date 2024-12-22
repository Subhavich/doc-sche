import { useState, useEffect } from "react";
import { Pagination, ReadOnlyTBody, THead } from "./TableComponents";
import { deriveWeeks } from "./utils/rendering";
import { Summary, SuperSummary } from "./SummaryComponents";

export default function ReadOnlyTablePage({
  tableSlots,
  tableDoctors,
  isGenerated,
}) {
  if (!isGenerated) {
    return <p>Please Gen Schedule First</p>;
  }

  if (!tableDoctors || !tableSlots) {
    return <p>No Data Yet</p>;
  }

  const [selectedDoctor, setSelectedDoctor] = useState("Ingrid");

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
      <SuperSummary doctors={tableDoctors} slots={tableSlots} />
    </>
  );
}

const Table = ({ slots, doctors, handleSelectDoctor }) => {
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState("default");

  const [currentWeek, setCurrentWeek] = useState(deriveWeeks(slots)[page]);

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

  useEffect(() => {
    setPage(0);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setMode((prev) => {
            console.log(currentWeek);
            return prev === "all" ? "default" : "all";
          });
        }}
      >
        Change Mode
      </button>
      {mode === "default" && (
        <>
          {" "}
          <Pagination pages={deriveWeeks(slots).length} setPage={setPage} />
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
        <div className="flex flex-col space-y-12 ">
          {deriveWeeks(slots).map((week, ind) => (
            <table>
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
