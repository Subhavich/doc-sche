import { validateSlotProblems } from "./utils/slotValidation";
import { useState, useEffect } from "react";
import { baseButton } from "./utils/tailwindGeneralClasses";

export const Summary = ({ selectedDoctor, slots, setSelectedDoctor }) => {
  const [theSlotsOfThisDoctor, setTheSlotsOfThisDoctor] = useState([]);

  useEffect(() => {
    // Update the slots of the selected doctor whenever `slots` changes
    setTheSlotsOfThisDoctor((prev) => {
      if (!selectedDoctor) {
        return slots.filter((slot) => {
          return slot.doctor == null;
        });
      }
      return slots.filter((slot) => {
        return slot.doctor === selectedDoctor;
      });
    });
  }, [slots, selectedDoctor]);

  return (
    <div className="flex flex-col space-y-4 mt-8 p-4 bg-blue-100 rounded-lg">
      <p className="text-xl font-semibold">Doctor's Summary</p>
      <p className="text-2xl font-thin">
        {selectedDoctor ? selectedDoctor : "Unassigned Slots"}
      </p>
      {selectedDoctor && (
        <>
          <div className="flex space-x-2">
            <p
              style={{ backgroundColor: "yellow" }}
              className="text-sm border rounded-md font-semibold px-4 py-1  "
            >
              {"Slots too close (>16 hours)"}
            </p>
            <p
              style={{ backgroundColor: "orange" }}
              className="text-sm border rounded-md font-semibold px-4 py-1 "
            >
              {"ER too close (<24 hours apart)"}
            </p>
            <p className="text-sm border rounded-md font-semibold px-4 py-1 bg-red-600">
              {"Both Rules"}
            </p>
          </div>
          <button
            className={` ${baseButton} self-start`}
            onClick={() => setSelectedDoctor(undefined)}
          >
            Show Unassigned Slots
          </button>
        </>
      )}
      <div className="flex flex-wrap gap-2">
        {theSlotsOfThisDoctor.map((slot, ind) => {
          const problemColor = validateSlotProblems(
            theSlotsOfThisDoctor[ind - 1],
            slot,
            theSlotsOfThisDoctor[ind + 1]
          );

          return (
            <b
              className="border border-blue-700 rounded p-1"
              style={{
                backgroundColor: !selectedDoctor ? "" : problemColor,
              }}
              key={ind}
            >
              {`Day ${new Date(slot.date).getDate()} - ${slot.type}`}
            </b>
          );
        })}
      </div>
    </div>
  );
};

export const SuperSummary = ({ doctors, slots }) => {
  return (
    <>
      <p>SUPERSUM</p>
      {doctors
        .slice()
        .sort((a, b) => b.slots.length - a.slots.length)
        .map((doctor, i) => {
          const theSlotsOfThisDoctor = slots.filter(
            (slot) => slot.doctor === doctor.name
          );
          return (
            <div key={i}>
              <b>{doctor.name}</b>
              <div
                style={{
                  display: "flex",
                  maxWidth: "120px",
                  flexWrap: "wrap",
                }}
              >
                {theSlotsOfThisDoctor.map((slot, ind) => {
                  const problemColor = validateSlotProblems(
                    theSlotsOfThisDoctor[ind - 1],
                    slot,
                    theSlotsOfThisDoctor[ind + 1]
                  );

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
              <p>THIS MONTH ADV: {doctor.quota}</p>
              <p>LAST MONTH ADV: {doctor.lastMonthAdv}</p>
            </div>
          );
        })}
    </>
  );
};
