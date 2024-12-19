export const isOverlapping = (baseSlot, compareSlot) => {
  if (!baseSlot || !compareSlot) {
    return false;
  }
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  return baseStart < compareEnd && baseEnd > compareStart;
};

export const isERConsecutive = (baseSlot, compareSlot) => {
  if (!baseSlot || !compareSlot) {
    return false;
  }
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  const ERSpacing = 24;

  // if (!baseSlot || !compareSlot) {
  //   return;
  // }
  if (baseSlot.type.includes("ER") && compareSlot.type.includes("ER")) {
    return (
      Math.abs(baseStart - compareEnd) <= ERSpacing ||
      Math.abs(baseEnd - compareStart) <= ERSpacing
    );
  }
  return false;
};

export const isAdequateSpacing = (baseSlot, compareSlot) => {
  //Less than or equal 16
  if (!baseSlot || !compareSlot) {
    return false;
  }
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

export const canAddSlot = (doctor, slot) => {
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
    return false;
  }

  if (
    rightSlotIndex < doctor.slots.length &&
    isOverlapping(doctor.slots[rightSlotIndex], slot)
  ) {
    return false;
  }

  return true;
};

export const hasUnassignedSlots = (slots) => {
  let hasUnassignedSlots = false;
  for (let slot of slots) {
    if (!slot.doctor) {
      hasUnassignedSlots = true;
    }
  }
  return hasUnassignedSlots;
};
