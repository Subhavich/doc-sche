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

const sortDoctors = (doctors) => {
  doctors.sort((a, b) => a.slots.length - b.slots.length);
};

const addSlot = (doctor, slot, force = false) => {
  let insertIndex = 0;
  console.log(doctor);
  //determine insertion position according to t
  while (
    insertIndex < doctor.slots.length &&
    doctor.slots[insertIndex].t < slot.t
  ) {
    insertIndex++;
  }

  console.log(doctor.slots);

  const leftSlotIndex = insertIndex - 1;
  const rightSlotIndex = insertIndex;

  if (leftSlotIndex >= 0 && isOverlapping(doctor.slots[leftSlotIndex], slot)) {
    throw new Error("Overlapping Slot");
  }

  if (
    rightSlotIndex >= 0 &&
    isOverlapping(doctor.slots[rightSlotIndex], slot)
  ) {
    throw new Error("Overlapping Slot");
  }

  if (!force) {
    console.log(leftSlotIndex);
    console.log(doctor.slots[leftSlotIndex], slot);
    if (
      (leftSlotIndex >= 0 &&
        isERConsecutive(doctor.slots[leftSlotIndex], slot)) ||
      (rightSlotIndex < doctor.slots.length &&
        isERConsecutive(doctor.slots[rightSlotIndex], slot))
    ) {
      throw new Error("Consecutive ER slots are not allowed");
    }
    if (
      (leftSlotIndex >= 0 &&
        isAdequateSpacing(doctor.slots[leftSlotIndex], slot)) ||
      (rightSlotIndex < doctor.slots.length &&
        isAdequateSpacing(doctor.slots[rightSlotIndex], slot))
    ) {
      throw new Error("Inadequate slot spacing");
    }
  }

  doctor.slots.splice(insertIndex, 0, slot);
  slot.doctor = doctor.name;
};

const scheduleSlots = (doctors, slots) => {
  // console.log("Before sorting:", [...doctors]);
  // sortDoctors(doctors);
  // console.log("After sorting:", [...doctors]);

  for (const slot of slots) {
    sortDoctors(doctors);

    let takeSlot = false;
    for (const doctor of doctors) {
      try {
        addSlot(doctor, slot);
      } catch (e) {
        console.log("Error", e);
      }
    }
  }
};

//
//
//
//
//
//

export default function TablePage({ config, setConfig, doctors }) {
  const monthArray = generateMonthSlots(
    config.scheduleStart.year,
    config.scheduleStart.month
  );

  const flatMappedSlots = monthArray.flatMap((ele) => ele.slots);
  // Schedule flatmappedslots here
  // Write an operation to map doctors to slot and slots to doctors

  scheduleSlots(doctors, flatMappedSlots);
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
          {config.doctors.map((doctor, ind) => (
            <b key={ind}> + {doctor.name} + </b>
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
