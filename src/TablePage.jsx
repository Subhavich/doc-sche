import { ThaiHolidayCalendar } from "./utils/holiday";
import {
  isERConsecutive,
  isAdequateSpacing,
  isOverlapping,
} from "./utils/slotValidation";
import { MONTHS, DAYS } from "./utils/static";

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

export default function TablePage({ config, setConfig }) {
  const doctors = config.doctors.map((doctor) => {
    return { ...doctor };
  });
  if (doctors.length >= 1) {
    doctors[0].name = "Byleth";
    console.log(doctors[0]);
  }
  // config.doctors.map();

  const monthArray = generateMonthSlots(
    config.scheduleStart.year,
    config.scheduleStart.month
  );

  const flatMappedSlots = monthArray.flatMap((ele) => ele.slots);
  // Schedule flatmappedslots here
  // Write an operation to map doctors to slot and slots to doctors

  const firstDateSlots = monthArray[0].slots;

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
            <b> + {doctor.name} + </b>
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
