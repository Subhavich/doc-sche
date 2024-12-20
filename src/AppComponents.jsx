import { clearLocalStorage, loadFromLocalStorage } from "./utils/localStorage";
import { hasUnassignedSlots } from "./utils/slotValidation";
import { MOCKDOCSFULL } from "./utils/static";

export const ClearStorageButton = () => {
  return (
    <div>
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
        RESET
      </button>
    </div>
  );
};
export const SwitchDispButton = ({ display, setDisplay }) => {
  const text = display === "table" ? "Edit Doctors " : "Back To Table ";
  return (
    <div>
      <button
        onClick={() => {
          setDisplay((prev) => (prev === "table" ? "edit" : "table"));
        }}
      >
        {text}
      </button>
    </div>
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
        + Generate Next Month
      </button>
    </div>
  );
};

export const UseMockDoctorsButton = ({ config, setConfig }) => {
  return (
    <button
      onClick={() => {
        setConfig((prev) => {
          return { ...prev, doctors: MOCKDOCSFULL };
        });
      }}
    >
      USE MOCKDOCS
    </button>
  );
};
