import { DAYS, WORKTYPES } from "./utils/static";
import { canAddSlot } from "./utils/slotValidation";
import { useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp, FiTrash } from "react-icons/fi";

export const Pagination = ({ pages, setPage }) => {
  return (
    <ul>
      {Array.from({ length: pages }).map((item, ind) => (
        <button key={ind} onClick={() => setPage(ind)}>
          {ind}
        </button>
      ))}
    </ul>
  );
};

export const TBody = ({
  slots,
  doctors,
  handleRemoveDoctor,
  handleAddDoctor,
  currentWeek,
}) => {
  return (
    <>
      <tbody>
        {WORKTYPES.map((worktype, ind) => (
          <tr key={ind}>
            <th>{worktype}</th>
            {DAYS.map((day, i) => {
              const targetedSlot = currentWeek[i].slots.filter((slot) => {
                return slot.type === worktype;
              });
              return (
                <td key={i}>
                  {targetedSlot.map((slot, j) => (
                    <div key={j}>
                      <DoctorButton
                        doctorName={slot.doctor ? slot.doctor : "Unassigned"}
                        id={slot.id}
                        handleRemoveDoctor={handleRemoveDoctor}
                        handleAddDoctor={handleAddDoctor}
                        slots={slots}
                        doctors={doctors}
                      />
                    </div>
                  ))}
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
}) => {
  return (
    <>
      <tbody>
        {WORKTYPES.map((worktype, ind) => (
          <tr key={ind}>
            <th>{worktype}</th>
            {DAYS.map((day, i) => {
              const targetedSlot = currentWeek[i].slots.filter((slot) => {
                return slot.type === worktype;
              });
              return (
                <td key={i}>
                  {targetedSlot.map((slot, j) => (
                    <div key={j}>
                      <ReadOnlyDoctorButton
                        doctorName={slot.doctor ? slot.doctor : "Unassigned"}
                        id={slot.id}
                        slots={slots}
                        doctors={doctors}
                      />
                    </div>
                  ))}
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
}) => {
  const [showList, setShowList] = useState(false);
  const handleToggleShow = () => {
    setShowList((prev) => !prev);
  };
  const renderedDoctor = doctors.find((doctor) => doctor.name === doctorName);
  return (
    <>
      <button
        style={{
          backgroundColor: renderedDoctor ? renderedDoctor.color : "slateblue",
        }}
      >
        {doctorName}
      </button>
      {doctorName === "Unassigned" && (
        <>
          <button onClick={handleToggleShow}>
            {showList ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {showList && (
            <DoctorList
              slots={slots}
              doctors={doctors}
              id={id}
              handleAddDoctor={handleAddDoctor}
              handleToggleShow={handleToggleShow}
            />
          )}
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
    </>
  );
};

const ReadOnlyDoctorButton = ({ doctors, doctorName }) => {
  const renderedDoctor = doctors.find((doctor) => doctor.name === doctorName);
  return (
    <>
      <button
        style={{
          backgroundColor: renderedDoctor ? renderedDoctor.color : "slateblue",
        }}
      >
        {doctorName}
      </button>
    </>
  );
};

const DoctorList = ({ slots, doctors, id, handleAddDoctor }) => {
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
    <ul>
      {filteredDoctors
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((doctor) => (
          <button
            key={doctor.name}
            onClick={() => {
              handleAddDoctor(id, doctor.name);
              handleToggleShow();
            }}
            className="list-btn"
          >
            {doctor.name}
          </button>
        ))}
    </ul>
  );
};

export const THead = () => {
  return (
    <thead>
      <tr>
        <th>"PLACEHOLDERS"</th>
        {DAYS.map((day, ind) => (
          <th key={ind}>{day.toUpperCase()}</th>
        ))}
      </tr>
    </thead>
  );
};
