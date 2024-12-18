import { useState, useEffect } from "react";
import { Pagination, TBody, THead } from "./TableComponents";
import { deriveWeeks } from "./utils/rendering";
import { saveToLocalStorage } from "./utils/localStorage";
export default function TablePage({
  tableSlots,
  setTableSlots,
  tableDoctors,
  setTableDoctors,
  isGenerated,
}) {
  if (!isGenerated) {
    return <p>Please Gen Schedule First</p>;
  }
  // Save to localStorage whenever tableSlots or tableDoctors changes
  useEffect(() => {
    saveToLocalStorage("tableSlots", tableSlots);
  }, [tableSlots]);

  useEffect(() => {
    saveToLocalStorage("tableDoctors", tableDoctors);
  }, [tableDoctors]);

  const handleRemoveDoctor = (slotId) => {
    setTableSlots((prev) => {
      const targetedSlot = [...prev].find((slot) => slot.id === slotId);
      console.log(targetedSlot);
      const newSlot = { ...targetedSlot, doctor: undefined };
      const filteredSlots = [...prev].filter((slot) => slot.id !== slotId);
      const newSlots = [...filteredSlots, newSlot];
      return newSlots;
    });

    setTableDoctors((prevDoctors) => [
      ...prevDoctors.map((doctor) => ({
        ...doctor,
        slots: doctor.slots.filter((slot) => slot.id !== slotId),
      })),
    ]);
  };

  const handleAddDoctor = (slotId, doctorName) => {
    let updatedSlot;

    setTableSlots((prev) => {
      const targetedSlot = prev.find((slot) => slot.id === slotId);
      if (!targetedSlot) return prev;

      updatedSlot = { ...targetedSlot, doctor: doctorName }; // Save the updated slot
      return prev.map((slot) => (slot.id === slotId ? updatedSlot : slot));
    });

    // Use the `updatedSlot` directly
    setTableDoctors((prevDoctors) => {
      return prevDoctors.map((doctor) => {
        if (doctor.name === doctorName) {
          if (!doctor.slots.some((slot) => slot.id === slotId)) {
            return {
              ...doctor,
              slots: [...doctor.slots, updatedSlot].sort((a, b) => a.t - b.t),
            };
          }
        }
        return doctor;
      });
    });
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
      />
    </>
  );
}

export const Table = ({
  slots,
  handleRemoveDoctor,
  handleAddDoctor,
  doctors,
}) => {
  const [page, setPage] = useState(0);
  const currentWeek = deriveWeeks(slots)[page];
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
