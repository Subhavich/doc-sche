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
