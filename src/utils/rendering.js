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

export const showDayDetail = (slots) => {
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

export const deriveWeeks = (slots) => {
  const startDate = new Date(slots[0].date);

  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  ).getDate(); // Corrected: Extract the day of the month as a number

  const startDayOfWeek = startDate.getDay();
  const monthArray = [];
  let currentDate = 1;
  let weekIndex = 0;
  let currentWeekDay = startDayOfWeek === 0 ? 7 : startDayOfWeek;

  while (currentDate <= endDate) {
    const weekArray = [];

    if (weekIndex === 0) {
      for (let dayOfWeek = 1; dayOfWeek < currentWeekDay; dayOfWeek++) {
        weekArray.push({ date: null, slots: [] });
      }
    }

    for (let dayOfWeek = currentWeekDay; dayOfWeek <= 7; dayOfWeek++) {
      if (currentDate <= endDate) {
        const filteredSlots = slots.filter(
          (slot) => new Date(slot.date).getDate() === currentDate
        );
        // console.log(filteredSlots);
        weekArray.push({ date: currentDate, slots: filteredSlots });
        currentDate++;
      } else {
        weekArray.push({ date: null, slots: [] });
      }
    }
    monthArray.push(weekArray);
    weekIndex++;
    currentWeekDay = 1;
  }
  // console.log(monthArray);
  return monthArray;
};
