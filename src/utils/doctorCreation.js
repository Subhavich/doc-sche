export const createNewDoctor = (name, color) => {
  return {
    name: name,
    color: color,
    slots: [],
    quota: 0,
    lastMonthAdv: 0,
    omitERNight: false,
  };
};
