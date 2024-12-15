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

export const TBody = ({ slots }) => {
  const page = 0;
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
                  <p>{slot.doctor ? slot.doctor : "UNASSIGNED"}</p>
                ))}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};
