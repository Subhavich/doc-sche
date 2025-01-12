import { useState, useEffect, useRef } from "react";
import { Pagination, TBody, THead } from "./TableComponents";
import { deriveWeeks } from "./utils/rendering";
import { saveToLocalStorage } from "./utils/localStorage";
import { Summary, SuperSummary } from "./SummaryComponents";
import { calculateAccumulatedCost } from "./utils/derivingValues";
import { baseButton } from "./utils/tailwindGeneralClasses";
import { hasUnassignedSlots } from "./utils/slotValidation";
import html2canvas from "html2canvas";
import { useAuth } from "./store/AuthContext";

export default function TablePage({
  tableSlots,
  setTableSlots,
  tableDoctors,
  setTableDoctors,
  isGenerated,
  workHistory,
  handleAddNewMonth,
}) {
  const { isAuthenticated, authenticate } = useAuth();

  if (!isGenerated) {
    return <p>Please Gen Schedule First</p>;
  }

  const [selectedDoctor, setSelectedDoctor] = useState();

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
      <DoctorSettings
        doctors={tableDoctors}
        setTableDoctors={setTableDoctors}
        slots={tableSlots}
        handleAddNewMonth={handleAddNewMonth}
      />
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
        setSelectedDoctor={setSelectedDoctor}
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

const Table = ({
  slots,
  handleRemoveDoctor,
  handleAddDoctor,
  handleSelectDoctor,
  doctors,
}) => {
  const [page, setPage] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(deriveWeeks(slots)[page]);
  const [mode, setMode] = useState("default");
  // default/all
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
        <div>
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
            <TBody
              slots={slots}
              doctors={doctors}
              handleRemoveDoctor={handleRemoveDoctor}
              handleAddDoctor={handleAddDoctor}
              handleSelectDoctor={handleSelectDoctor}
              page={page}
              setPage={setPage}
              currentWeek={currentWeek}
            />
          </table>
        </div>
      )}
      {mode === "all" && (
        <div ref={divRef} className="flex flex-col space-y-12 ">
          <p className="text-center mb-8 text-xl">
            Month : {new Date(slots[0].date).getMonth() + 1} Year :{" "}
            {new Date(slots[0].date).getFullYear()}
          </p>
          {deriveWeeks(slots).map((week, ind) => (
            <table>
              <THead currentWeek={deriveWeeks(slots)[ind]} />
              <TBody
                slots={slots}
                doctors={doctors}
                handleRemoveDoctor={handleRemoveDoctor}
                handleAddDoctor={handleAddDoctor}
                handleSelectDoctor={handleSelectDoctor}
                page={ind}
                setPage={setPage}
                currentWeek={deriveWeeks(slots)[ind]}
              />
            </table>
          ))}
        </div>
      )}
    </>
  );
};

const DoctorSettings = ({
  doctors,
  setTableDoctors,
  slots,
  handleAddNewMonth,
}) => {
  return (
    <>
      <p className="text-xl mb-2 font-semibold">Set Doctor's Preference</p>
      <div className="mb-8 rounded p-4 bg-blue-100">
        <div className=" mb-2 flex flex-wrap gap-2 ">
          {doctors.map((doctor, ind) => (
            <DoctorField
              key={ind}
              doctors={doctors}
              doctorName={doctor.name}
              omitStatus={doctor.omitERNight}
              setTableDoctors={setTableDoctors}
            />
          ))}
        </div>
        <button
          className={`${baseButton} bg-blue-800 text-white`}
          onClick={() => {
            if (hasUnassignedSlots(slots)) {
              alert("There are still Unassigned Slots");
              return;
            }
            handleAddNewMonth();
          }}
        >
          + Generate Next Month
        </button>
      </div>
    </>
  );
};

const DoctorField = ({ doctorName, omitStatus, setTableDoctors }) => {
  const checkboxref = useRef();
  return (
    <>
      <div className="bg-white p-3 rounded ">
        <b>{doctorName}</b>
        <div className="flex space-x-4 ">
          <label htmlFor="ERNight">Omit ERNight</label>
          <input
            type="checkbox"
            ref={checkboxref}
            id="ERNight"
            name="ERNight"
            checked={omitStatus}
            onChange={() => {
              setTableDoctors((prev) => {
                const newDoctors = [
                  ...prev.map((doctor) =>
                    doctor.name === doctorName
                      ? { ...doctor, omitERNight: checkboxref.current.checked }
                      : { ...doctor }
                  ),
                ];
                return newDoctors;
              });
            }}
          />
        </div>
      </div>
    </>
  );
};
