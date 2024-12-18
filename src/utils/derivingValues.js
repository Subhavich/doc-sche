export function calculateAccumulatedCost(doctorName, slots) {
  // Step 1: Create a map to count the number of slots each doctor has
  const doctorSlotCounts = {};

  slots.forEach((slot) => {
    if (slot.doctor) {
      if (!doctorSlotCounts[slot.doctor]) {
        doctorSlotCounts[slot.doctor] = 0;
      }
      doctorSlotCounts[slot.doctor]++;
    }
  });

  // Step 2: Find the maximum number of slots any doctor has
  const maxSlots = Math.max(...Object.values(doctorSlotCounts));

  // Step 3: Get the number of slots for the input doctor
  const doctorSlots = doctorSlotCounts[doctorName] || 0;

  // Step 4: Calculate and return the deficit
  return maxSlots - doctorSlots;
}
