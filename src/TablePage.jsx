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

const generateMonthArray = (year, monthIndex) => {
  console.log(year, monthIndex);
  const startDateOfMonth = new Date(year, monthIndex);

  const endDateOfMonth = new Date(year, monthIndex + 1, 0).getDate();

  const startDayOfWeek = startDateOfMonth.getDay();

  const monthArray = [];
  let currentDate = 1;
  let weekIndex = 0;

  // Adjust to treat Sunday as the last day of the week (7 instead of 0)
  let currentWeekDay = startDayOfWeek === 0 ? 7 : startDayOfWeek;

  // Loop through the whole month
  while (currentDate <= endDateOfMonth) {
    const weekArray = [];

    // Fill empty days for the first week before the 1st of the month
    if (weekIndex === 0) {
      for (let dayOfWeek = 1; dayOfWeek < currentWeekDay; dayOfWeek++) {
        weekArray.push({ date: null }); // Empty slot before the 1st of the month
      }
    }

    // Fill the week with valid dates
    for (let dayOfWeek = currentWeekDay; dayOfWeek <= 7; dayOfWeek++) {
      if (currentDate <= endDateOfMonth) {
        weekArray.push({ date: currentDate });
        currentDate++;
      } else {
        weekArray.push({ date: null }); // Empty slot after the last day of the month
      }
    }

    monthArray.push(weekArray);
    weekIndex++;
    // Reset the current day of the week to 1 (Monday) for the next iteration
    currentWeekDay = 1;
  }
  //   console.log("b4 flatmap", monthArray);
  //   console.log(
  //     "after flatmap",
  //     monthArray.flatMap((ele) => ele)
  //   );
  return monthArray;
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

const generateMonthSlots = (year, monthIndex) => {
  const startDateOfMonth = new Date(year, monthIndex, 1);
  const startDayOfMonth = startDateOfMonth.getDay();

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
    // console.log(currentDate, DAYS[dayIndex - 1]);
    // console.log(createDay(today));
    currentDate++;
  }
  return monthArray;
};

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function TablePage({ config }) {
  const monthArray = generateMonthSlots(
    config.scheduleStart.year,
    config.scheduleStart.month
  );

  const flatMappedSlots = monthArray.flatMap((ele) => ele.slots);

  flatMappedSlots[0].doctor = "Byleth";
  const firstSlotFirstDate = monthArray[0].slots[0];
  console.log(firstSlotFirstDate);
  // Write an operation to map doctors to slot and slots to doctors

  return (
    <>
      <h3>Table Page</h3>
      <p>
        <b>Logger</b>
      </p>
      <div>
        <p>{config.scheduleStart.year}</p>
        <p>{config.scheduleStart.month}</p>
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
