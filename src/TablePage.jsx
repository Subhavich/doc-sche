import { TBody, THead } from "./TableComponents";
export default function TablePage({ initialSlots, doctors }) {
  console.log("received ", initialSlots);
  console.log("received ", doctors);
  return (
    <>
      <Table slots={initialSlots} />
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

export const Table = ({ slots }) => {
  return (
    <table>
      <THead />
      <TBody slots={slots} />
    </table>
  );
};
