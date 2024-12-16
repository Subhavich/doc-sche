import { createNewDoctor } from "./doctorCreation";
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const WORKTYPES = [
  "ERNight",
  "ERMorning",
  "ERAfternoon",
  "Med",
  "NonMed",
];

export const MOCKDOCS = [
  createNewDoctor("Byleth", "lightblue"),
  createNewDoctor("El", "salmon"),
  createNewDoctor("Hilda", "lightpink"),
  createNewDoctor("Claude", "lightyellow"),
  createNewDoctor("Lysithea", "plum"),
  createNewDoctor("Dimitri", "skyblue"),
  createNewDoctor("Edelgard", "gainsboro"),
  createNewDoctor("Petra", "lightgreen"),
  createNewDoctor("Felix", "peachpuff"),
];
