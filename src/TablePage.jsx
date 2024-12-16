import { useState, useEffect } from "react";
import { TBody, THead } from "./TableComponents";
export default function TablePage({ initialSlots, doctors }) {
  const [tableSlots, setTableSlots] = useState(() => {
    const savedSlots = loadFromLocalStorage("tableSlots");
    return savedSlots || initialSlots; // Use saved data or initial data
  });

  const [tableDoctors, setTableDoctors] = useState(() => {
    const savedDoctors = loadFromLocalStorage("tableDoctors");
    return savedDoctors || doctors; // Use saved data or initial data
  });

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

  return (
    <>
      <Table
        doctors={tableDoctors}
        slots={tableSlots}
        handleRemoveDoctor={handleRemoveDoctor}
        handleAddDoctor={handleAddDoctor}
      />
      <h3>Table Page</h3>
      <div>
        <h3>Assigned Slots</h3>
      </div>
      <div>
        {initialSlots.map((slot) => (
          <p>
            {slot.id} {slot.doctor}
          </p>
        ))}
      </div>
    </>
  );
}

export const Table = ({
  slots,
  handleRemoveDoctor,
  handleAddDoctor,
  doctors,
}) => {
  return (
    <table>
      <THead />
      <TBody
        slots={slots}
        doctors={doctors}
        handleRemoveDoctor={handleRemoveDoctor}
        handleAddDoctor={handleAddDoctor}
      />
    </table>
  );
};

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading from localStorage", error);
    return null;
  }
};
