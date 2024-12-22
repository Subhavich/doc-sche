import { useRef, useState, useEffect } from "react";
import { Compact } from "@uiw/react-color";
import { createNewDoctor } from "./utils/doctorCreation";
import { MONTHS } from "./utils/static";
import { DoctorData } from "./EditPageComponents";
import { ClearStorageButton } from "./AppComponents";
import { tailwindHexColors } from "./utils/static";
import { baseButton } from "./utils/tailwindGeneralClasses";
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
      <div className="p-4 bg-blue-50/75 mb-2 rounded">
        <h2 className=" font-semibold text-2xl mb-2">Settings</h2>
        <div className="flex space-x-2 mb-4">
          <p className=" py-1">Select Starting Month</p>

          <input
            className="border rounded px-2 py-1"
            type="number"
            min="1900"
            max="2100"
            value={config.scheduleStart.year}
            onChange={(e) => handleStartChange("year", e)}
          />
          {/* Month Dropdown */}
          <select
            className="border rounded px-2"
            value={config.scheduleStart.month}
            onChange={(e) => handleStartChange("month", e)}
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
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
      <div className=" px-4 mb-4 space-y-2">
        {config.doctors.length > 0 && (
          <h3 className="font-semibold  text-xl">Add or Delete doctors</h3>
        )}

        <div className="grid grid-cols-12 gap-2">
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
        </div>
      </div>
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
      <div className="  bg-blue-50/75 p-4 space-y-4 w-1/2 rounded">
        <div className="flex justify-between ">
          <span className="font-semibold">Input Doctor's Name </span>
          <input
            className="border rounded px-2 py-1 "
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddDoctor(inputRef.current.value, hex);
                inputRef.current.value = "";
              }
            }}
          />
        </div>
        <div className=" flex flex-col space-y-2 justify-between ">
          <span className="font-semibold">Select Doctor's color </span>
          <div
            onClick={() => setIsPicker((prev) => !prev)}
            className="size-8 rounded"
            style={{
              backgroundColor: hex,
            }}
          ></div>

          {isPickerVisible ? (
            <>
              <Compact
                style={{ backgroundColor: "white", maxWidth: "200px" }}
                ref={pickerRef}
                color={hex}
                colors={tailwindHexColors}
                onChange={(color) => {
                  setHex(color.hex);
                  setIsPicker(false);
                }}
              />
            </>
          ) : null}
        </div>
        <div className="flex justify-end">
          <button
            className={`${baseButton}`}
            onClick={() => {
              handleAddDoctor(inputRef.current.value, hex);
              inputRef.current.value = "";
            }}
          >
            Add Doctor
          </button>
        </div>
      </div>
    </>
  );
}

// function EditLogger({ config }) {
//   return (
//     <>
//       <h3>Logger</h3>

//       <hr />
//       <h3>Config Schedule Start</h3>
//       <p>Config Month Index : {config.scheduleStart.month}</p>
//       <p>Config Year : {config.scheduleStart.year}</p>
//       <h3>Config Doctors</h3>
//       {config.doctors.map((doctor, ind) => (
//         <b key={ind}>
//           {doctor.name} - {doctor.color}{" "}
//         </b>
//       ))}
//     </>
//   );
// }
