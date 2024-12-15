import { DAYS, WORKTYPES } from "./utils/static";
import { deriveWeeks } from "./utils/rendering";
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

export const TBody = ({ slots, handleRemoveDoctor }) => {
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

export const DoctorButton = ({ doctorName, id, handleRemoveDoctor }) => {
  return <button onClick={() => handleRemoveDoctor(id)}>{doctorName}</button>;
};
