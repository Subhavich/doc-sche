export const isOverlapping = (baseSlot, compareSlot) => {
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  return baseStart < compareEnd && baseEnd > compareStart;
};

export const isERConsecutive = (baseSlot, compareSlot) => {
  const baseStart = baseSlot.t;
  const baseEnd = baseSlot.t + baseSlot.duration;
  const compareStart = compareSlot.t;
  const compareEnd = compareSlot.t + compareSlot.duration;
  const ERSpacing = 24;

  if (baseSlot.type.includes("ER") && compareSlot.type.includes("ER")) {
    return (
      Math.abs(baseStart - compareEnd) <= ERSpacing ||
      Math.abs(baseEnd - compareStart) <= ERSpacing
    );
  }
  return false;
};

export const isAdequateSpacing = (baseSlot, compareSlot) => {
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
