import { useRef, useState, useEffect } from "react";
import { Compact } from "@uiw/react-color";
import { createNewDoctor } from "./utils/doctorCreation";
import { MONTHS } from "./utils/static";
import { clearLocalStorage } from "./utils/localStorage";
// Editing Page

export default function EditingPage({
  tableDoctors,
  setTableDoctors,
  tableSlots,
  setTableSlots,
  config,
  setConfig,
  isGenerated,
}) {
  const handleStartChange = (load, e) => {
    setConfig((pv) => {
      const newValue = e.target.value;
      return {
        ...pv,
        scheduleStart: { ...pv.scheduleStart, [load]: newValue },
      };
    });
  };

  const handleAddDoctor = (load, color) => {
    setConfig((prev) => {
      const newDoctor = createNewDoctor(load, color);
      // console.log({ ...prev, doctors: [...prev.doctors, newDoctor] });
      return { ...prev, doctors: [...prev.doctors, newDoctor], accumulated: 0 };
    });
  };

  const [generated, setGenerated] = useState(isGenerated);
  return (
    <>
      {/* Just for Logging */}
      <p>
        <b>Logger</b>
      </p>
      <p>{config.scheduleStart.month}</p> <p>{config.scheduleStart.year}</p>
      {config.doctors.map((doctor, ind) => (
        <b key={ind}>
          {doctor.name} - {doctor.color}{" "}
        </b>
      ))}
      {/* Just for Logging */}
      <hr />
      <p>Select Starting Month</p>
      <DateInput
        setConfig={setConfig}
        handleStartChange={handleStartChange}
        config={config}
      />
      <p>Add or Delete doctors</p>
      <DoctorSection
        config={config}
        setConfig={setConfig}
        setTableDoctors={setTableDoctors}
        setTableSlots={setTableSlots}
        tableDoctors={tableDoctors}
        tableSlots={tableSlots}
      />
      {!generated && (
        <DoctorInput config={config} handleAddDoctor={handleAddDoctor} />
      )}
      {generated && (
        <button
          onClick={() => {
            clearLocalStorage(["tableSlots", "tableDoctors", "isGenerated"]);
            console.log("Local storage cleared.");
            setGenerated((prev) => !prev);
          }}
        >
          Add Doctors (Table Will Be Recreated)
        </button>
      )}
      {!generated && isGenerated && (
        <button onClick={() => setGenerated((prev) => !prev)}>
          Regenerate Table
        </button>
      )}
    </>
  );
}

export function DateInput({ config, handleStartChange }) {
  return (
    <>
      <input
        type="number"
        min="1900"
        max="2100"
        value={config.scheduleStart.year}
        onChange={(e) => handleStartChange("year", e)}
      />
      {/* Month Dropdown */}
      <select
        value={config.scheduleStart.month}
        onChange={(e) => handleStartChange("month", e)}
      >
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
    </>
  );
}

export function DoctorInput({ handleAddDoctor, setConfig }) {
  const [hex, setHex] = useState("#eee");
  const [isPickerVisible, setIsPicker] = useState(false);

  const inputRef = useRef();
  const pickerRef = useRef();

  return (
    <>
      <p>doctors</p>
      <input
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddDoctor(inputRef.current.value, hex);
            inputRef.current.value = "";
          }
        }}
      />
      <div
        onClick={() => setIsPicker((prev) => !prev)}
        style={{ width: "32px", height: "32px", backgroundColor: hex }}
      ></div>
      {isPickerVisible ? (
        <>
          <Compact
            ref={pickerRef}
            style={{ backgroundColor: "#fff" }}
            color={hex}
            onChange={(color) => {
              setHex(color.hex);
            }}
          />

          <button onClick={() => setIsPicker((prev) => !prev)}>Back</button>
        </>
      ) : null}
      <button
        onClick={() => {
          handleAddDoctor(inputRef.current.value, hex);
          inputRef.current.value = "";
        }}
      >
        Add Doctor
      </button>
    </>
  );
}

export function DoctorSection({
  config,
  setConfig,
  tableDoctors,
  tableSlots,
  setTableDoctors,
  setTableSlots,
}) {
  return (
    <>
      {config.doctors.map((doctor, ind) => (
        <DoctorData
          key={ind}
          setConfig={setConfig}
          name={doctor.name}
          color={doctor.color}
          setTableDoctors={setTableDoctors}
          setTableSlots={setTableSlots}
          tableDoctors={tableDoctors}
          tableSlots={tableSlots}
        />
      ))}
    </>
  );
}

export function DoctorData({
  name,
  color,
  setConfig,
  tableDoctors,
  tableSlots,
  setTableDoctors,
  setTableSlots,
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [hex, setHex] = useState(color);
  const [isPickerVisible, setIsPicker] = useState(false);

  const nameRef = useRef();
  const componentRef = useRef();
  const pickerRef = useRef();
  useEffect(() => {
    setHex(color);
  }, [color]);
  const handleUpdateDoctorName = () => {
    const newDoctorName = nameRef.current.value;

    // Step 1: Update the doctor name in the config state
    setConfig((prev) => {
      const index = prev.doctors.findIndex((doctor) => doctor.name === name);
      const newDoctors = [...prev.doctors];
      newDoctors[index] = createNewDoctor(
        newDoctorName,
        newDoctors[index].color,
        newDoctors[index].slots
      );
      return { ...prev, doctors: newDoctors };
    });

    // Step 2: Only update tableDoctors and tableSlots if table has been generated
    if (tableDoctors && tableSlots) {
      setTableDoctors((prevDoctors) => {
        const updatedTableDoctors = prevDoctors.map((doctor) =>
          doctor.name === name ? { ...doctor, name: newDoctorName } : doctor
        );
        return updatedTableDoctors;
      });

      setTableSlots((prevSlots) => {
        const updatedTableSlots = prevSlots.map((slot) =>
          slot.doctor === name ? { ...slot, doctor: newDoctorName } : slot
        );
        return updatedTableSlots;
      });
    } else {
      console.log("Table not generated yet. Only config updated.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // When Enter is pressed
      setIsRenaming(false);
      handleUpdateDoctorName();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close renaming input
      if (
        isRenaming &&
        componentRef.current &&
        !componentRef.current.contains(e.target)
      ) {
        setIsRenaming(false);
        handleUpdateDoctorName();
      }

      // Close color picker
      if (
        isPickerVisible &&
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !componentRef.current.contains(e.target)
      ) {
        setIsPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRenaming, isPickerVisible]);
  // console.log(setConfig);

  return (
    <div
      ref={componentRef}
      style={{
        border: "2px solid black",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      {isRenaming ? (
        <input onKeyDown={handleKeyDown} defaultValue={name} ref={nameRef} />
      ) : (
        <p>{name}</p>
      )}

      <div
        onClick={() => setIsPicker((prev) => !prev)}
        style={{ width: "32px", height: "32px", backgroundColor: hex }}
      ></div>
      {isPickerVisible ? (
        <>
          <Compact
            ref={pickerRef}
            style={{ backgroundColor: "#fff" }}
            color={hex}
            onChange={(color) => {
              setHex(color.hex);
              setConfig((prev) => {
                const targetedDoctorIndex = prev.doctors.findIndex((doctor) => {
                  return doctor.name === name;
                });
                const newDoctors = [...prev.doctors];
                newDoctors[targetedDoctorIndex] = createNewDoctor(
                  name,
                  color.hex
                );

                return { ...prev, doctors: newDoctors };
              });
            }}
          />

          <button onClick={() => setIsPicker((prev) => !prev)}>Back</button>
        </>
      ) : null}

      <button
        onClick={() => {
          if (isRenaming) {
            handleUpdateDoctorName();
          }
          setIsRenaming((prev) => !prev);
        }}
      >
        {isRenaming ? "Confirm" : "Rename Doctor"}
      </button>
      <button
        onClick={() => {
          // Step 1: Update config to remove the doctor
          setConfig((prev) => {
            const updatedDoctors = prev.doctors.filter(
              (doctor) => doctor.name !== name
            );
            return { ...prev, doctors: updatedDoctors };
          });

          // Step 2: Clear tableSlots and tableDoctors (reset mechanism)
          clearLocalStorage(["tableSlots", "tableDoctors", "isGenerated"]);
          setTableSlots(null);
          setTableDoctors(null);
          console.log("Doctor deleted. Table will be recreated.");
        }}
      >
        Delete
      </button>
    </div>
  );
}
