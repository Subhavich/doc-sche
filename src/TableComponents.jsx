import { DAYS, WORKTYPES } from "./utils/static";
import { canAddSlot } from "./utils/slotValidation";
import { useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp, FiTrash } from "react-icons/fi";
import { baseButton } from "./utils/tailwindGeneralClasses";
import { hasUnassignedSlots } from "./utils/slotValidation";

export const Pagination = ({ pages, setPage, page }) => {
  return (
    <>
      <ul className="text-xl flex justify-center space-x-4 mb-4 w-full">
        {Array.from({ length: pages }).map((item, ind) => (
          <button
            className={`${
              page === ind ? "bg-blue-700 scale-125 text-white" : ""
            } px-2 py-1 rounded`}
            key={ind}
            onClick={() => setPage(ind)}
          >
            {ind}
          </button>
        ))}
      </ul>
    </>
  );
};

export const THead = ({ currentWeek }) => {
  return (
    <thead>
      <tr>
        <th className=" border-transparent"></th>
        {currentWeek.map((day, ind) => (
          <th className=" border-transparent" key={ind}>
            <div className="w-full h-full bg-blue-100 rounded-lg py-2">
              <p className="">{DAYS[ind].toUpperCase()}</p>
              <p>{day.date ? day.date : "-"}</p>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TBody = ({
  slots,
  doctors,
  handleRemoveDoctor,
  handleAddDoctor,
  handleSelectDoctor,
  currentWeek,
}) => {
  return (
    <>
      <tbody>
        {WORKTYPES.map((worktype, ind) => (
          <tr key={ind}>
            <th className="text-right p-2 size-28 border-transparent font-normal text-sm">
              {worktype}
            </th>
            {DAYS.map((day, i) => {
              const targetedSlot = currentWeek[i].slots.filter((slot) => {
                return slot.type === worktype;
              });
              return (
                <td className="border-transparent size-28 p-0.5" key={i}>
                  <div className=" w-full h-full bg-blue-100 rounded-lg flex flex-col space-y-2 p-2">
                    {targetedSlot.map((slot, j) => (
                      <div key={j}>
                        <DoctorButton
                          doctorName={slot.doctor ? slot.doctor : "Unassigned"}
                          id={slot.id}
                          handleRemoveDoctor={handleRemoveDoctor}
                          handleAddDoctor={handleAddDoctor}
                          handleSelectDoctor={handleSelectDoctor}
                          slots={slots}
                          doctors={doctors}
                        />
                      </div>
                    ))}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </>
  );
};

export const ReadOnlyTBody = ({
  slots,
  doctors,
  page,
  setPage,
  currentWeek,
  handleSelectDoctor,
}) => {
  return (
    <>
      <tbody>
        {WORKTYPES.map((worktype, ind) => (
          <tr key={ind}>
            <th className="text-right p-2 size-28 border-transparent font-normal text-sm">
              {worktype}
            </th>
            {DAYS.map((day, i) => {
              const targetedSlot = currentWeek[i].slots.filter((slot) => {
                return slot.type === worktype;
              });
              return (
                <td className="border-transparent size-28 p-0.5" key={i}>
                  <div className=" w-full h-full bg-blue-100 rounded-lg flex flex-col space-y-2 p-2">
                    {targetedSlot.map((slot, j) => (
                      <ReadOnlyDoctorButton
                        doctorName={slot.doctor ? slot.doctor : "Unassigned"}
                        id={slot.id}
                        slots={slots}
                        doctors={doctors}
                        handleSelectDoctor={handleSelectDoctor}
                      />
                    ))}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </>
  );
};

const DoctorButton = ({
  slots,
  doctors,
  doctorName,
  id,
  handleRemoveDoctor,
  handleAddDoctor,
  handleSelectDoctor,
}) => {
  const [showList, setShowList] = useState(false);
  const handleToggleShow = () => {
    setShowList((prev) => !prev);
  };
  const renderedDoctor = doctors.find((doctor) => doctor.name === doctorName);
  return (
    <>
      <div
        className="p-1 flex justify-around text-xs rounded relative"
        style={{
          backgroundColor: renderedDoctor ? renderedDoctor.color : "slateblue",
        }}
      >
        {showList && (
          <DoctorList
            slots={slots}
            doctors={doctors}
            id={id}
            handleAddDoctor={handleAddDoctor}
            handleToggleShow={handleToggleShow}
          />
        )}
        <button
          onClick={() => {
            if (doctorName === "Unassigned") {
              return;
            }
            handleSelectDoctor(doctorName);
          }}
        >
          {doctorName}
        </button>
        {doctorName === "Unassigned" && (
          <>
            <button onClick={handleToggleShow}>
              {showList ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </>
        )}

        {doctorName !== "Unassigned" && (
          <button
            onClick={() => {
              handleRemoveDoctor(id);
            }}
          >
            <FiTrash />
          </button>
        )}
      </div>
    </>
  );
};

const ReadOnlyDoctorButton = ({ doctors, doctorName, handleSelectDoctor }) => {
  const renderedDoctor = doctors.find((doctor) => doctor.name === doctorName);
  return (
    <>
      <button
        className="p-1 flex justify-around text-xs rounded relative"
        onClick={() => handleSelectDoctor(doctorName)}
        style={{
          backgroundColor: renderedDoctor ? renderedDoctor.color : "slateblue",
        }}
      >
        {doctorName}
      </button>
    </>
  );
};

const DoctorList = ({
  slots,
  doctors,
  id,
  handleAddDoctor,
  handleToggleShow,
}) => {
  const thisSlot = useMemo(
    () => slots.find((slot) => slot.id === id),
    [slots, id]
  );

  const filteredDoctors = useMemo(() => {
    if (!thisSlot) return [];
    return doctors.filter((doctor) => {
      // Exclude doctors already assigned to this slot
      if (thisSlot.doctor === doctor.name) return false;

      // Use `canAddSlot` to validate if the doctor can take the slot
      return canAddSlot(doctor, thisSlot);
    });
  }, [doctors, thisSlot]);

  return (
    <ul className="absolute z-20 flex flex-col top-full w-full divide-y-2">
      {filteredDoctors
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((doctor) => (
          <button
            className=" last-of-type:rounded-b-lg p-1 bg-white"
            key={doctor.name}
            onClick={() => {
              handleAddDoctor(id, doctor.name);
              handleToggleShow();
            }}
          >
            {doctor.name}
          </button>
        ))}
    </ul>
  );
};
