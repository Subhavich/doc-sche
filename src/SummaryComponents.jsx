import { isAdequateSpacing, isERConsecutive } from "./utils/slotValidation";
import { calculateAccumulatedCost } from "./utils/derivingValues";
import { useState, useEffect } from "react";

export const Summary = ({ selectedDoctor, slots }) => {
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
              <p>{doctor.quota}</p>
            </div>
          );
        })}
    </>
  );
};

//calculateAccumulatedCost(doctor.name, slots)
