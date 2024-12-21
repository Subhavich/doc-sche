import { validateSlotProblems } from "./utils/slotValidation";
import { useState, useEffect } from "react";

export const Summary = ({ selectedDoctor, slots }) => {
  const [theSlotsOfThisDoctor, setTheSlotsOfThisDoctor] = useState([]);

  useEffect(() => {
    // Update the slots of the selected doctor whenever `slots` changes
    setTheSlotsOfThisDoctor(
      slots.filter((slot) => slot.doctor === selectedDoctor)
    );
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
          const problemColor = validateSlotProblems(
            theSlotsOfThisDoctor[ind - 1],
            slot,
            theSlotsOfThisDoctor[ind + 1]
          );

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
