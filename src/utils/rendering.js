export const generateMonthArray = (year, monthIndex) => {
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

  return monthArray;
};

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

export const deriveWeeksFromSlots = (year, monthIndex, slots) => {
  const startDateOfMonth = new Date(year, monthIndex, 1);
  const endDateOfMonth = new Date(year, monthIndex + 1, 0);
  const totalDaysInMonth = endDateOfMonth.getDate();

  // Adjust Sunday to 7 for easier week calculations
  const startDayOfWeek =
    startDateOfMonth.getDay() === 0 ? 7 : startDateOfMonth.getDay();

  const weeks = [];
  let currentWeek = [];
  let dayOfWeek = startDayOfWeek;

  for (let date = 1; date <= totalDaysInMonth; date++) {
    // Find slots for the current date
    const daySlots = slots.filter((slot) => slot.date.getDate() === date);

    // Add day slots to the current week
    currentWeek.push(...daySlots);

    // If the current day is Sunday or the last day of the month, push the week
    if (dayOfWeek === 7 || date === totalDaysInMonth) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }

    // Move to the next day of the week (reset to 1 for Monday after Sunday)
    dayOfWeek = dayOfWeek === 7 ? 1 : dayOfWeek + 1;
  }

  return weeks;
};
