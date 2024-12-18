import { useState, useEffect } from "react";
import { Pagination, TBody, THead } from "./TableComponents";
import { deriveWeeks } from "./utils/rendering";
import { saveToLocalStorage } from "./utils/localStorage";
import { isAdequateSpacing, isERConsecutive } from "./utils/slotValidation";
import { calculateAccumulatedCost } from "./utils/derivingValues";
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

  const [selectedDoctor, setSelectedDoctor] = useState("Ingrid");

  useEffect(() => {
    saveToLocalStorage("tableSlots", tableSlots);
  }, [tableSlots]);

  useEffect(() => {
    saveToLocalStorage("tableDoctors", tableDoctors);
  }, [tableDoctors]);

  const handleRemoveDoctor = (slotId) => {
    setTableSlots((prev) => {
      return prev.map((slot) =>
        slot.id === slotId ? { ...slot, doctor: null } : slot
      );
    });

    setTableDoctors((prevDoctors) =>
      prevDoctors.map((doctor) => ({
        ...doctor,
        slots: doctor.slots.filter((slot) => slot.id !== slotId),
      }))
    );
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
      <Summary
        selectedDoctor={selectedDoctor}
        slots={tableSlots}
        doctors={tableDoctors}
      />
      <SuperSummary doctors={tableDoctors} slots={tableSlots} />
    </>
  );
}
const Summary = ({ selectedDoctor, slots }) => {
  const [theSlotsOfThisDoctor, setTheSlotsOfThisDoctor] = useState([]);

  useEffect(() => {
    // Update the slots of the selected doctor whenever `slots` changes
    const filteredSlots = slots.filter(
      (slot) => slot.doctor === selectedDoctor
    );
    setTheSlotsOfThisDoctor(filteredSlots);
  }, [slots, selectedDoctor]);

  return (
    <div>
      <p>SUMMARY</p>
      <b>{selectedDoctor}</b>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          maxWidth: "500px",
          flexWrap: "wrap",
        }}
      >
        {theSlotsOfThisDoctor.map((slot, ind) => {
          const erProblem =
            isERConsecutive(
              theSlotsOfThisDoctor[ind - 1],
              theSlotsOfThisDoctor[ind]
            ) ||
            isERConsecutive(
              theSlotsOfThisDoctor[ind],
              theSlotsOfThisDoctor[ind + 1]
            );
          const adequateProblem =
            isAdequateSpacing(
              theSlotsOfThisDoctor[ind - 1],
              theSlotsOfThisDoctor[ind]
            ) ||
            isAdequateSpacing(
              theSlotsOfThisDoctor[ind],
              theSlotsOfThisDoctor[ind + 1]
            );
          const bothProblem = adequateProblem && erProblem;

          const problemColor = (() => {
            switch (true) {
              case bothProblem:
                return "red";
              case erProblem:
                return "orange";
              case adequateProblem:
                return "yellow";
              default:
                return null; // No problem
            }
          })();

          return (
            <b
              style={{
                border: "1px solid slategray",
                backgroundColor: problemColor,
              }}
              key={ind}
            >
              {slot.id}
            </b>
          );
        })}
      </div>
    </div>
  );
};

const SuperSummary = ({ doctors, slots }) => {
  return (
    <>
      <p>SUPERSUM</p>
      {doctors.map((doctor) => {
        const theSlotsOfThisDoctor = slots.filter(
          (slot) => slot.doctor === doctor.name
        );
        return (
          <div>
            <b>{doctor.name}</b>
            <div
              style={{ display: "flex", maxWidth: "120px", flexWrap: "wrap" }}
            >
              {theSlotsOfThisDoctor.map((slot, ind) => {
                const erProblem =
                  isERConsecutive(
                    theSlotsOfThisDoctor[ind - 1],
                    theSlotsOfThisDoctor[ind]
                  ) ||
                  isERConsecutive(
                    theSlotsOfThisDoctor[ind],
                    theSlotsOfThisDoctor[ind + 1]
                  );
                const adequateProblem =
                  isAdequateSpacing(
                    theSlotsOfThisDoctor[ind - 1],
                    theSlotsOfThisDoctor[ind]
                  ) ||
                  isAdequateSpacing(
                    theSlotsOfThisDoctor[ind],
                    theSlotsOfThisDoctor[ind + 1]
                  );
                const bothProblem = adequateProblem && erProblem;

                const problemColor = (() => {
                  switch (true) {
                    case bothProblem:
                      return "red";
                    case erProblem:
                      return "orange";
                    case adequateProblem:
                      return "yellow";
                    default:
                      return null; // No problem
                  }
                })();

                return (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "1px solid black",
                      backgroundColor: problemColor,
                    }}
                    key={ind}
                  ></div>
                );
              })}
            </div>
            <p>{calculateAccumulatedCost(doctor.name, slots)}</p>
          </div>
        );
      })}
    </>
  );
};

const Table = ({ slots, handleRemoveDoctor, handleAddDoctor, doctors }) => {
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
