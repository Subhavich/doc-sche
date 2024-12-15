import { DAYS } from "./utils/static";
import { deriveWeeks } from "./utils/rendering";
export const THead = () => {
  return (
    <thead>
      <tr>
        {DAYS.map((day) => (
          <th>{day.toUpperCase()}</th>
        ))}
      </tr>
    </thead>
  );
};

export const TBody = ({ slots }) => {
  const mockCtg = ["er1", "er2"];

  deriveWeeks(slots);

  return <tbody></tbody>;
};
