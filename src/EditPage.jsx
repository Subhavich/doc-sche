import { useRef, useState, useEffect } from "react";
import { Compact } from "@uiw/react-color";
import { createNewDoctor } from "./utils/doctorCreation";
import { MONTHS } from "./utils/static";
import { DoctorData } from "./EditPageComponents";
import { ClearStorageButton } from "./AppComponents";
export default function EditingPage({
  tableDoctors,
  setTableDoctors,
  tableSlots,
  setTableSlots,
  config,
  setConfig,
  isGenerated,
  handleGenerateSchedule,
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
      {/* <EditLogger config={config} />

      <hr /> */}
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
      {generated && <ClearStorageButton />}
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
      <div>
        <span>Input Doctor's Name : </span>
        <input
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddDoctor(inputRef.current.value, hex);
              inputRef.current.value = "";
            }
          }}
        />
      </div>
      <div
        onClick={() => setIsPicker((prev) => !prev)}
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: hex,
          margin: "16px",
        }}
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
