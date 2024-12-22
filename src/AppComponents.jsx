import { clearLocalStorage, loadFromLocalStorage } from "./utils/localStorage";
import { hasUnassignedSlots } from "./utils/slotValidation";
import { MOCKDOCSFULL } from "./utils/static";
import { baseButton } from "./utils/tailwindGeneralClasses";

export const Bar = ({ children }) => {
  return <div className=" flex space-x-4 py-4">{children}</div>;
};

export const ClearStorageButton = () => {
  return (
    <button
      className={baseButton}
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
      Reset App
    </button>
  );
};
export const SwitchDispButton = ({ display, setDisplay }) => {
  const text = display === "table" ? "Edit Doctors " : "Back To Table ";
  return (
    <div>
      <button
        className={baseButton}
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
        <button
          className="my-6 py-4 px-2 bg-blue-700 text-white rounded"
          onClick={handleGenerateSchedule}
        >
          Generate Schedule
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
  activePage,
}) => {
  return (
    <div className="bg-blue-100 mb-4 p-4 rounded space-x-4">
      {workHistory.map((month, ind) => {
        return (
          <button
            className={`${baseButton} bg-white ${
              activePage === ind ? " scale-125" : "null"
            }`}
            key={ind}
            onClick={() => handleSelectPage(ind)}
          >
            {Number(month.date.month) + 1} - {month.date.year}
          </button>
        );
      })}
    </div>
  );
};
export const UseMockDoctorsButton = ({ config, setConfig }) => {
  return (
    <button
      className={baseButton}
      onClick={() => {
        setConfig((prev) => {
          return { ...prev, doctors: MOCKDOCSFULL };
        });
      }}
    >
      Use Mock Doctors
    </button>
  );
};
