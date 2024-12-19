import { useRef, useState, useEffect } from "react";
import { Compact } from "@uiw/react-color";
import { createNewDoctor } from "./utils/doctorCreation";
import { MONTHS } from "./utils/static";
import { clearLocalStorage } from "./utils/localStorage";

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
      console.log("Prev", { ...pv }.scheduleStart);
      const newValue = e.target.value;
      console.log({
        ...pv,
        scheduleStart: { ...pv.scheduleStart, [load]: Number(newValue) },
      });
      return {
        ...pv,
        scheduleStart: { ...pv.scheduleStart, [load]: Number(newValue) },
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
      <EditLogger config={config} />

      <hr />

      {!isGenerated && (
        <DateInput
          setConfig={setConfig}
          handleStartChange={handleStartChange}
          config={config}
        />
      )}

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

function DateInput({ config, handleStartChange }) {
  return (
    <>
      <b style={{ marginRight: "16px" }}>Select Starting Month</b>

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

function DoctorInput({ handleAddDoctor, setConfig }) {
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

function DoctorSection({
  config,
  setConfig,
  tableDoctors,
  tableSlots,
  setTableDoctors,
  setTableSlots,
}) {
  return (
    <>
      <h3>Add or Delete doctors</h3>
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

function DoctorData({
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
      const updatedDoctors = prev.doctors.map((doctor) =>
        doctor.name === name ? { ...doctor, name: newDoctorName } : doctor
      );
      return { ...prev, doctors: updatedDoctors };
    });

    // Step 2: Update tableDoctors and tableSlots if table exists
    if (tableDoctors && tableSlots) {
      setTableDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.name === name ? { ...doctor, name: newDoctorName } : doctor
        )
      );

      setTableSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.doctor === name ? { ...slot, doctor: newDoctorName } : slot
        )
      );
    }
  };

  const handleUpdateDoctorColor = (newColor) => {
    setHex(newColor);

    // Step 1: Update color in config state
    setConfig((prev) => {
      const updatedDoctors = prev.doctors.map((doctor) =>
        doctor.name === name ? { ...doctor, color: newColor } : doctor
      );
      return { ...prev, doctors: updatedDoctors };
    });

    // Step 2: Update tableDoctors only if they exist
    if (tableDoctors) {
      setTableDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.name === name ? { ...doctor, color: newColor } : doctor
        )
      );
    } else {
      console.log("Table has not been generated yet. Only config updated.");
    }
  };

  const handleDeleteDoctor = () => {
    setConfig((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((doctor) => doctor.name !== name),
    }));

    // Step 2: Clear tableSlots and tableDoctors (reset mechanism)
    clearLocalStorage(["tableSlots", "tableDoctors", "isGenerated"]);
    setTableSlots(null);
    setTableDoctors(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setIsRenaming(false);
      handleUpdateDoctorName();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isPickerVisible &&
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        setIsPicker(false);
      }

      if (
        isRenaming &&
        componentRef.current &&
        !componentRef.current.contains(e.target)
      ) {
        setIsRenaming(false);
        handleUpdateDoctorName();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPickerVisible, isRenaming]);

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
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: hex,
        }}
      ></div>

      {isPickerVisible && (
        <Compact
          ref={pickerRef}
          color={hex}
          onChange={(color) => handleUpdateDoctorColor(color.hex)}
        />
      )}

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

      <button onClick={handleDeleteDoctor}>Delete</button>
    </div>
  );
}

function EditLogger({ config }) {
  return (
    <>
      <h3>Logger</h3>

      <hr />
      <h3>Config Schedule Start</h3>
      <p>Config Month Index : {config.scheduleStart.month}</p>
      <p>Config Year : {config.scheduleStart.year}</p>
      <h3>Config Doctors</h3>
      {config.doctors.map((doctor, ind) => (
        <b key={ind}>
          {doctor.name} - {doctor.color}{" "}
        </b>
      ))}
    </>
  );
}
