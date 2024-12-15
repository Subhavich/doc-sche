import { useState } from "react";
import { TBody, THead } from "./TableComponents";
export default function TablePage({ initialSlots, doctors }) {
  const [tableSlots, setTableSlots] = useState(initialSlots);

  const handleRemoveDoctor = (slotId) => {
    setTableSlots((prev) => {
      console.log("In handle remove doctor", prev);
      const filteredSlots = [...prev.filter((slot) => slot.id !== slotId)];
      console.log(filteredSlots);
      return filteredSlots;
    });
  };

  return (
    <>
      <Table slots={tableSlots} handleRemoveDoctor={handleRemoveDoctor} />
      <h3>Table Page</h3>
      <div>
        <h3>Assigned Slots</h3>
      </div>
      <div>
        {initialSlots.map((slot) => (
          <p>
            {slot.id} {slot.doctor}
          </p>
        ))}
      </div>
    </>
  );
}

export const Table = ({ slots, handleRemoveDoctor }) => {
  return (
    <table>
      <THead />
      <TBody slots={slots} handleRemoveDoctor={handleRemoveDoctor} />
    </table>
  );
};
