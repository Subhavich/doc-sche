import { ThaiHolidayCalendar } from "./utils/holiday";
import {
  isERConsecutive,
  isAdequateSpacing,
  isOverlapping,
} from "./utils/slotValidation";
import { MONTHS } from "./utils/static";
import { useState, useEffect } from "react";
import { deriveWeeksFromSlots } from "./utils/rendering";

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
  console.log(monthArray);
  return monthArray;
};

const sortDoctors = (doctors) => {
  doctors.sort((a, b) => a.slots.length - b.slots.length);
};

const addSlot = (doctor, slot, force = false) => {
  let insertIndex = 0;

  // Determine insertion position according to t
  while (
    insertIndex < doctor.slots.length &&
    doctor.slots[insertIndex].t < slot.t
  ) {
    insertIndex++;
  }

  const leftSlotIndex = insertIndex - 1;
  const rightSlotIndex = insertIndex;

  // Validation checks for overlapping slots
  if (leftSlotIndex >= 0 && isOverlapping(doctor.slots[leftSlotIndex], slot)) {
    throw new Error("Overlapping Slot");
  }

  if (
    rightSlotIndex < doctor.slots.length &&
    isOverlapping(doctor.slots[rightSlotIndex], slot)
  ) {
    throw new Error("Overlapping Slot");
  }

  // Additional validations
  if (!force) {
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

  // Assign slot to doctor
  const newSlot = { ...slot, doctor: doctor.name }; // Deep copy of slot with doctor assigned
  console.log(`Adding slot ${newSlot.id} to doctor ${doctor.name}`);
  doctor.slots.splice(insertIndex, 0, newSlot);
};

const scheduleSlots = (doctors, slots) => {
  doctors.forEach((doctor) => {
    doctor.slots = [];
  });

  for (const slot of slots) {
    sortDoctors(doctors);

    let assigned = false;

    for (const doctor of doctors) {
      try {
        addSlot(doctor, slot);

        // Update the reference in `slots` as well
        const updatedSlotIndex = slots.findIndex((s) => s.id === slot.id);
        if (updatedSlotIndex !== -1) {
          slots[updatedSlotIndex].doctor = doctor.name;
        }

        assigned = true;
        break;
      } catch (e) {
        // Slot cannot be assigned to this doctor, continue
      }
    }

    if (!assigned) {
      slot.doctor = undefined;
    }
  }
};

export default function TablePage({ config, doctors }) {
  const monthArray = generateMonthSlots(
    config.scheduleStart.year,
    config.scheduleStart.month
  );

  const allSlots = monthArray.flatMap((ele) =>
    ele.slots.map((slot) => ({ ...slot, doctor: undefined }))
  );

  const [initialSchedule, setInitialSchedule] = useState(null);
  const [weekSlots, setWeekSlots] = useState([]);

  useEffect(() => {
    scheduleSlots(doctors, allSlots);
    console.log("All Slots After Scheduling:", allSlots);

    const schedule = {
      slots: allSlots.map((slot) => ({ ...slot })), // Correctly updated slots
      doctors: doctors.map((doctor) => ({
        ...doctor,
        slots: doctor.slots.map((slot) => ({ ...slot })),
      })),
    };

    console.log(schedule);
    setInitialSchedule(schedule);
  }, []);

  useEffect(() => {
    if (initialSchedule) {
      console.log("InitialSchedule Slots:", initialSchedule.slots);
      const weeks = deriveWeeksFromSlots(
        config.scheduleStart.year,
        config.scheduleStart.month,
        initialSchedule.slots
      );
      console.log("Derived Weeks:", weeks);

      setWeekSlots(weeks);
    }
  }, [initialSchedule]);

  if (!initialSchedule) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h3>Table Page</h3>
      <div>
        {initialSchedule.doctors.map((doctor, ind) => (
          <div key={ind}>
            <b>{doctor.name}</b>
            {doctor.slots.map((slot) => (
              <p key={slot.id}>
                {slot.id} - {slot.doctor}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div>
        <h3>Weekly Slots</h3>
        {weekSlots.map((week, weekIndex) => (
          <div key={weekIndex}>
            <h4>Week {weekIndex + 1}</h4>
            {week.map((slot) => (
              <div key={slot.id}>
                <span>Slot ID: {slot.id}</span>
                <span>Type: {slot.type}</span>
                <span>Doctor: {slot.doctor || "UNASSIGNED"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
