import { useState, useEffect } from "react";
import { Pagination, TBody, THead } from "./TableComponents";
import { deriveWeeks } from "./utils/rendering";
import { saveToLocalStorage } from "./utils/localStorage";
import { Summary, SuperSummary } from "./SummaryComponents";
import { calculateAccumulatedCost } from "./utils/derivingValues";
import { use } from "react";
export default function TablePage({
  tableSlots,
  setTableSlots,
  tableDoctors,
  setTableDoctors,
  isGenerated,
  workHistory,
}) {
  if (!isGenerated) {
    return <p>Please Gen Schedule First</p>;
  }

  const [selectedDoctor, setSelectedDoctor] = useState("Ingrid");

  const handleSelectDoctor = (load) => {
    setSelectedDoctor(load);
  };

  useEffect(() => {
    saveToLocalStorage("tableSlots", tableSlots);
  }, [tableSlots]);

  useEffect(() => {
    saveToLocalStorage("tableDoctors", tableDoctors);
  }, [tableDoctors]);

  const handleRemoveDoctor = (slotId) => {
    let updatedSlots;
    setTableSlots((prev) => {
      updatedSlots = prev.map((slot) =>
        slot.id === slotId ? { ...slot, doctor: null } : slot
      );
      return updatedSlots;
    });

    setTableDoctors((prevDoctors) =>
      prevDoctors.map((doctor) => ({
        ...doctor,
        slots: doctor.slots.filter((slot) => slot.id !== slotId),
        quota: calculateAccumulatedCost(doctor.name, updatedSlots),
      }))
    );
  };

  const handleAddDoctor = (slotId, doctorName) => {
    let updatedSlot;
    let updatedSlots;

    setTableSlots((prev) => {
      const targetedSlot = prev.find((slot) => slot.id === slotId);
      if (!targetedSlot) return prev;

      updatedSlot = { ...targetedSlot, doctor: doctorName }; // Save the updated slot
      updatedSlots = prev.map((slot) =>
        slot.id === slotId ? updatedSlot : slot
      );
      return updatedSlots;
    });

    setTableDoctors((prevDoctors) =>
      prevDoctors.map((doctor) => ({
        ...doctor,
        slots:
          doctor.name === doctorName
            ? [...doctor.slots, updatedSlot].sort((a, b) => a.t - b.t)
            : doctor.slots,
        quota: calculateAccumulatedCost(doctor.name, updatedSlots), // Recalculate quota for all doctors
      }))
    );
  };

  if (!tableDoctors || !tableSlots) {
    return <p>No Data Yet</p>;
  }

  return (
    <>
      <Table
        doctors={tableDoctors}
        slots={tableSlots}
        handleRemoveDoctor={handleRemoveDoctor}
        handleAddDoctor={handleAddDoctor}
        handleSelectDoctor={handleSelectDoctor}
        workHistory={workHistory}
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

const Table = ({
  slots,
  handleRemoveDoctor,
  handleAddDoctor,
  doctors,
  workHistory,
}) => {
  const [page, setPage] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(deriveWeeks(slots)[page]);

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
      <Pagination pages={deriveWeeks(slots).length} setPage={setPage} />
      <table>
        <THead />
        <TBody
          slots={slots}
          doctors={doctors}
          handleRemoveDoctor={handleRemoveDoctor}
          handleAddDoctor={handleAddDoctor}
          page={page}
          setPage={setPage}
          currentWeek={currentWeek}
        />
      </table>
    </>
  );
};
