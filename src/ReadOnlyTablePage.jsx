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

  return (
    <>
      <Table doctors={tableDoctors} slots={tableSlots} />
      <Summary
        selectedDoctor={selectedDoctor}
        slots={tableSlots}
        doctors={tableDoctors}
      />
      <SuperSummary doctors={tableDoctors} slots={tableSlots} />
    </>
  );
}

const Table = ({ slots, doctors }) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    console.log(deriveWeeks(slots));
  }, [slots]);

  const currentWeek = deriveWeeks(slots)[page];
  return (
    <>
      <Pagination pages={deriveWeeks(slots).length} setPage={setPage} />
      <table>
        <THead />
        <ReadOnlyTBody
          slots={slots}
          doctors={doctors}
          page={page}
          setPage={setPage}
          currentWeek={currentWeek}
        />
      </table>
    </>
  );
};
