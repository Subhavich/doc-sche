import { clearLocalStorage, loadFromLocalStorage } from "./utils/localStorage";
import { hasUnassignedSlots } from "./utils/slotValidation";

export const ClearStorageButton = () => {
  return (
    <button
      onClick={() => {
        clearLocalStorage([
          "tableSlots",
          "tableDoctors",
          "isGenerated",
          "config",
          "workHistory",
        ]);
        console.log("Local storage cleared.");
        window.location.reload();
      }}
    >
      Clear Local
    </button>
  );
};
export const SwitchDispButton = ({ setDisplay }) => {
  return (
    <button
      onClick={() => {
        setDisplay((prev) => (prev === "table" ? "edit" : "table"));
      }}
    >
      Switch display
    </button>
  );
};
export const GenerateTableButton = ({ handleGenerateSchedule }) => {
  return (
    <>
      {!loadFromLocalStorage("isGenerated") && (
        <button onClick={handleGenerateSchedule}>
          Generate Schedule and View Table
        </button>
      )}
    </>
  );
};
export const HistoryPagination = ({
  workHistory,
  handleAddNewMonth,
  tableSlots,
  handleSelectPage,
}) => {
  return (
    <div>
      {workHistory.map((month, ind) => {
        return (
          <button key={ind} onClick={() => handleSelectPage(ind)}>
            {Number(month.date.month) + 1} - {month.date.year}
          </button>
        );
      })}
      <button
        onClick={() => {
          if (hasUnassignedSlots(tableSlots)) {
            console.log("still has unassigned slots");
            return;
          }
          handleAddNewMonth();
        }}
      >
        +
      </button>
    </div>
  );
};
