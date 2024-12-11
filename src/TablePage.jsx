import { ThaiHolidayCalendar } from "./utils/holiday";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const showDayDetail = (slots) => {
  for (let slot of slots) {
    console.log(
      "Day : ",
      slot.date.getDate(),
      " Start Time : ",
      slot.startTime,
      " Start T : ",
      slot.t,
      slot.type,
      "ID : ",
      slot.id
    );
  }
};

const isOverlapping = (baseSlot, compareSlot) => {
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  return baseStart < compareEnd && baseEnd > compareStart;
};

const isERConsecutive = (baseSlot, compareSlot) => {
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  const ERSpacing = 24;

  if (baseSlot.type.includes("ER") && compareSlot.type.includes("ER")) {
    return (
      Math.abs(baseStart - compareEnd) <= ERSpacing ||
      Math.abs(baseEnd - compareStart) <= ERSpacing
    );
  }
  return false;
};

const isAdequateSpacing = (baseSlot, compareSlot) => {
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  const adequateSpacing = 16;
  return (
    Math.abs(baseStart - compareEnd) <= adequateSpacing ||
    Math.abs(baseEnd - compareStart) <= adequateSpacing
  );
};

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// const generateMonthArray = (year, monthIndex) => {
//   console.log(year, monthIndex);
//   const startDateOfMonth = new Date(year, monthIndex);

//   const endDateOfMonth = new Date(year, monthIndex + 1, 0).getDate();

//   const startDayOfWeek = startDateOfMonth.getDay();

//   const monthArray = [];
//   let currentDate = 1;
//   let weekIndex = 0;

//   // Adjust to treat Sunday as the last day of the week (7 instead of 0)
//   let currentWeekDay = startDayOfWeek === 0 ? 7 : startDayOfWeek;

//   // Loop through the whole month
//   while (currentDate <= endDateOfMonth) {
//     const weekArray = [];

//     // Fill empty days for the first week before the 1st of the month
//     if (weekIndex === 0) {
//       for (let dayOfWeek = 1; dayOfWeek < currentWeekDay; dayOfWeek++) {
//         weekArray.push({ date: null }); // Empty slot before the 1st of the month
//       }
//     }

//     // Fill the week with valid dates
//     for (let dayOfWeek = currentWeekDay; dayOfWeek <= 7; dayOfWeek++) {
//       if (currentDate <= endDateOfMonth) {
//         weekArray.push({ date: currentDate });
//         currentDate++;
//       } else {
//         weekArray.push({ date: null }); // Empty slot after the last day of the month
//       }
//     }

//     monthArray.push(weekArray);
//     weekIndex++;
//     // Reset the current day of the week to 1 (Monday) for the next iteration
//     currentWeekDay = 1;
//   }
//   //   console.log("b4 flatmap", monthArray);
//   //   console.log(
//   //     "after flatmap",
//   //     monthArray.flatMap((ele) => ele)
//   //   );
//   return monthArray;
// };

const createDay = (date) => {
  const isHoliday = ThaiHolidayCalendar.isHoliday(date);
  const isWeekEnd = date.getDay() === 0 || date.getDay() === 6;
  const specialCase = isHoliday || isWeekEnd;
  const slots = [];
  if (!specialCase) {
    slots.push(createSlot(date, 16, 8, "ERAfternoon", 1));
    slots.push(createSlot(date, 0, 8, "ERNight", 1));
    slots.push(createSlot(date, 16, 16, "Med", 1));
    slots.push(createSlot(date, 16, 16, "NonMed", 1));
  } else {
    slots.push(createSlot(date, 8, 8, "ERMorning", 1));
    slots.push(createSlot(date, 8, 8, "ERMorning", 2));
    slots.push(createSlot(date, 16, 8, "ERAfternoon", 1));
    slots.push(createSlot(date, 16, 8, "ERAfternoon", 2));
    slots.push(createSlot(date, 0, 8, "ERNight", 1));
    slots.push(createSlot(date, 8, 24, "Med", 1));
    slots.push(createSlot(date, 8, 24, "NonMed", 1));
  }
  return slots;
};

const createSlot = (date, startTime, duration, type, order) => {
  return {
    date,
    startTime,
    duration,
    t: (date.getDate() - 1) * 24 + startTime,
    type,
    order,
    id: date.getDate() + type + order,
    doctor: undefined,
  };
};

const generateMonthSlots = (year, monthIndex) => {
  const endDateOfMonth = new Date(year, monthIndex + 1, 0).getDate();

  const monthArray = [];
  let currentDate = 1;

  while (currentDate <= endDateOfMonth) {
    const today = new Date(year, monthIndex, currentDate);
    const dayIndex = today.getDay() === 0 ? 7 : today.getDay();
    monthArray.push({
      date: currentDate,
      month: MONTHS[monthIndex],
      slots: createDay(today),
    });

    currentDate++;
  }
  return monthArray;
};

//
//
//

export default function TablePage({ config, setConfig }) {
  const doctors = [...config.doctors];

  const monthArray = generateMonthSlots(
    config.scheduleStart.year,
    config.scheduleStart.month
  );

  const flatMappedSlots = monthArray.flatMap((ele) => ele.slots);
  //schedule flatmappedslots here
  // Write an operation to map doctors to slot and slots to doctors

  const firstDateSlots = monthArray[0].slots;
  // showDayDetail(firstDateSlots);

  // flatMappedSlots[0].doctor = "Byleth";
  // flatMappedSlots[1].doctor = "Marianne";

  // console.log(isOverlapping(flatMappedSlots[0], flatMappedSlots[1]));
  // console.log(isERConsecutive(flatMappedSlots[0], flatMappedSlots[6]));
  // console.log(monthArray);

  return (
    <>
      <h3>Table Page</h3>
      <p>
        <b>Logger</b>
      </p>
      <div>
        <p>{config.scheduleStart.year}</p>
        <p>{config.scheduleStart.month}</p>

        <div>
          {config.doctors.map((doctor) => (
            <b>{doctor.name}</b>
          ))}
        </div>
      </div>
      <div>
        <p>
          <b>Month Object</b>
        </p>
        <div></div>
      </div>
      <hr />
    </>
  );
}
