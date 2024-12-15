import { DAYS, WORKTYPES } from "./utils/static";
import { deriveWeeks } from "./utils/rendering";
import { canAddSlot } from "./utils/slotValidation";
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

export const TBody = ({ slots, doctors, handleRemoveDoctor }) => {
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
}) => {
  return (
    <>
      <button
        onClick={() => {
          handleRemoveDoctor(id);
        }}
      >
        {doctorName}
      </button>
      <DoctorList slots={slots} doctors={doctors} id={id} />
    </>
  );
};

export const DoctorList = ({ slots, doctors, id }) => {
  const thisSlot = slots.find((slot) => slot.id === id);
  console.log("ID being checked:", id);
  console.log("Slot corresponding to ID:", thisSlot);

  const filteredDoctors = doctors.filter((doctor) => {
    const result = canAddSlot(doctor, thisSlot);
    return result;
  });

  return (
    <ul>
      {filteredDoctors.map((doctor) => (
        <button key={doctor.name}>{doctor.name}</button>
      ))}
    </ul>
  );
};
