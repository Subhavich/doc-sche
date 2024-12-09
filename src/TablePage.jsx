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
        weekArray.push("fake"); // Empty slot before the 1st of the month
      }
    }

    // Fill the week with valid dates
    for (let dayOfWeek = currentWeekDay; dayOfWeek <= 7; dayOfWeek++) {
      if (currentDate <= endDateOfMonth) {
        weekArray.push("real");
        currentDate++;
      } else {
        weekArray.push("fake"); // Empty slot after the last day of the month
      }
    }

    monthArray.push(weekArray);
    weekIndex++;
    // Reset the current day of the week to 1 (Monday) for the next iteration
    currentWeekDay = 1;
  }

  return monthArray;
};

export default function TablePage({ config }) {
  console.log(
    generateMonthArray(config.scheduleStart.year, config.scheduleStart.month)
  );
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
