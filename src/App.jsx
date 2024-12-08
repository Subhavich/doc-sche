import { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState(true);
  return (
    <>
      <button onClick={() => setDisplay((prev) => (prev ? null : true))}>
        Switch display
      </button>
      {display ? <EditingPage /> : <TablePage />}
    </>
  );
}

export default App;

// Editing Page

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function EditingPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = months[new Date().getMonth()];

  const [config, setConfig] = useState({
    scheduleStart: { year: currentYear, month: currentMonth },
    doctors: [
      { name: "Davis", color: "red" },
      { name: "Anthony", color: "slategray" },
    ],
  });

  const handleStartChange = (load, e) => {
    setConfig((pv) => {
      const newValue = e.target.value;
      return {
        ...pv,
        scheduleStart: { ...pv.scheduleStart, [load]: newValue },
      };
    });
  };

  const handleAddDoctor = (load) => {
    setConfig((prev) => {
      const newDoctor = { name: load, color: "slategray" };
      return { ...prev, doctors: [...prev.doctors, newDoctor] };
    });
  };

  return (
    <>
      {/* Just for Logging */}
      <p>logger</p>
      <p>{config.scheduleStart.month}</p> <p>{config.scheduleStart.year}</p>
      {config.doctors.map((doctor, ind) => (
        <b key={ind}>{doctor.name} </b>
      ))}
      {/* Just for Logging */}
      <hr />
      <p>Select Starting Month</p>
      <DateInput handleStartChange={handleStartChange} config={config} />
      <p>Add or Delete doctors</p>
      <DoctorSection config={config} setConfig={setConfig} />
      <DoctorInput config={config} handleAddDoctor={handleAddDoctor} />
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
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </>
  );
}

export function DoctorInput({ config, handleAddDoctor }) {
  const inputRef = useRef();
  return (
    <>
      <p>doctors</p>
      <input
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddDoctor(inputRef.current.value);
            inputRef.current.value = "";
          }
        }}
      />
      <button
        onClick={() => {
          handleAddDoctor(inputRef.current.value);
          inputRef.current.value = "";
        }}
      >
        Add Doctor
      </button>
    </>
  );
}

export function DoctorSection({ config, setConfig }) {
  return (
    <>
      {config.doctors.map((doctor, ind) => (
        <DoctorData
          key={ind}
          setConfig={setConfig}
          name={doctor.name}
          color={doctor.color}
        />
      ))}
    </>
  );
}

export function DoctorData({ name, color, setConfig }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const nameRef = useRef();
  const componentRef = useRef();

  const handleUpdateDoctorName = (e) => {
    const newDoctorName = nameRef.current.value;
    setConfig((prev) => {
      const index = prev.doctors.findIndex((doctor) => {
        return name === doctor.name;
      });
      const newDoctors = [...prev.doctors];
      newDoctors[index].name = newDoctorName;
      return { ...prev, doctors: newDoctors };
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // When Enter is pressed
      setIsRenaming(false);
      handleUpdateDoctorName();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isRenaming &&
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsRenaming(false);
        handleUpdateDoctorName(); // Update doctor name when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRenaming]);

  return (
    <div
      ref={componentRef}
      style={{ border: "2px solid black", padding: "16px" }}
    >
      {isRenaming ? (
        <input onKeyDown={handleKeyDown} defaultValue={name} ref={nameRef} />
      ) : (
        <p>{name}</p>
      )}

      <div
        style={{ width: "32px", height: "32px", backgroundColor: color }}
      ></div>
      <button
        onClick={() => {
          if (isRenaming) {
            handleUpdateDoctorName();
          }
          setIsRenaming((prev) => !prev);
        }}
      >
        Rename Doctor
      </button>
      <button>Delete</button>
    </div>
  );
}

export function TablePage() {
  return <p>table page</p>;
}
