import { DAYS, WORKTYPES } from "./utils/static";
import { deriveWeeks } from "./utils/rendering";
import { canAddSlot } from "./utils/slotValidation";
import { useMemo, useState } from "react";
export const THead = () => {
  return (
    <thead>
      <tr>
        <th>"PLACEHOLDERS"</th>
        {DAYS.map((day) => (
          <th>{day.toUpperCase()}</th>
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
}) => {
  const page = 1;
  const mockWeek = deriveWeeks(slots)[page];

  return (
    <tbody>
      {WORKTYPES.map((worktype) => (
        <tr>
          <th>{worktype}</th>
          {DAYS.map((day, ind) => {
            console.log(worktype);
            const targetedSlot = mockWeek[ind].slots.filter((slot) => {
              return slot.type === worktype;
            });
            return (
              <td>
                {targetedSlot.map((slot) => (
                  <>
                    <DoctorButton
                      doctorName={slot.doctor ? slot.doctor : "Unassigned"}
                      id={slot.id}
                      handleRemoveDoctor={handleRemoveDoctor}
                      handleAddDoctor={handleAddDoctor}
                      slots={slots}
                      doctors={doctors}
                    />
                  </>
                ))}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export const DoctorButton = ({
  slots,
  doctors,
  doctorName,
  id,
  handleRemoveDoctor,
  handleAddDoctor,
}) => {
  const [showList, setShowList] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          handleRemoveDoctor(id);
        }}
      >
        {doctorName}
      </button>
      {doctorName === "Unassigned" && (
        <DoctorList
          slots={slots}
          doctors={doctors}
          id={id}
          handleAddDoctor={handleAddDoctor}
        />
      )}
    </>
  );
};

export const DoctorList = ({ slots, doctors, id, handleAddDoctor }) => {
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

  console.log(
    "Filtered Doctors:",
    filteredDoctors.sort((a, b) => a.name.localeCompare(b.name))
  );

  return (
    <ul>
      {filteredDoctors
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((doctor) => (
          <button
            key={doctor.name}
            onClick={() => handleAddDoctor(id, doctor.name)}
            className="list-btn"
          >
            {doctor.name}
          </button>
        ))}
    </ul>
  );
};
