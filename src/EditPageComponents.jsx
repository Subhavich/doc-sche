import { useState, useRef, useEffect } from "react";
import { Compact } from "@uiw/react-color";
import { clearLocalStorage, loadFromLocalStorage } from "./utils/localStorage";
import { tailwindHexColors } from "./utils/static";

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
  const checkboxref = useRef();

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
    clearLocalStorage([
      "tableSlots",
      "tableDoctors",
      "isGenerated",
      "workHistory",
    ]);
    setTableSlots(null);
    setTableDoctors(null);
  };

  const handleUpdateDoctorOmit = () => {
    setConfig((prev) => {
      const updatedDoctors = [
        ...prev.doctors.map((doctor) =>
          doctor.name === name
            ? { ...doctor, omitERNight: checkboxref.current.checked }
            : { ...doctor }
        ),
      ];
      console.log({ ...prev, doctors: updatedDoctors });
      return { ...prev, doctors: updatedDoctors };
    });
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
      className=" col-span-3 p-4
       border-2 border-blue-800 rounded space-y-2"
      ref={componentRef}
    >
      <div className="flex justify-between">
        {isRenaming ? (
          <input
            className=" text-lg max-w-28 ring-2 rounded"
            onKeyDown={handleKeyDown}
            defaultValue={name}
            ref={nameRef}
          />
        ) : (
          <span className="text-lg font-semibold">{name}</span>
        )}

        <button
          onClick={() => {
            if (isRenaming) {
              handleUpdateDoctorName();
            }
            setIsRenaming((prev) => !prev);
          }}
        >
          {isRenaming ? "Confirm" : "Rename"}
        </button>
      </div>

      {!loadFromLocalStorage("isGenerated") && (
        <>
          <div className="flex space-x-2 ">
            <label htmlFor="ERNight">Omit Night</label>
            <input
              type="checkbox"
              ref={checkboxref}
              id="ERNight"
              name="ERNight"
              onClick={() => {
                console.log(name, checkboxref.current.checked);
                handleUpdateDoctorOmit();
              }}
            />
          </div>
          <hr className=" border-blue-900/20" />
        </>
      )}

      <div
        onClick={() => setIsPicker((prev) => !prev)}
        className="size-8 rounded"
        style={{
          backgroundColor: hex,
        }}
      ></div>
      <div className="">
        {isPickerVisible && (
          <Compact
            style={{ backgroundColor: "white", maxWidth: "200px" }}
            ref={pickerRef}
            color={hex}
            colors={tailwindHexColors}
            onChange={(color) => {
              handleUpdateDoctorColor(color.hex);
              setIsPicker(false);
            }}
          />
        )}
      </div>

      <button onClick={handleDeleteDoctor}>Delete</button>
    </div>
  );
}
