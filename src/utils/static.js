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
  createNewDoctor("Byleth", "#ADD8E6"), // Light Blue
  createNewDoctor("Hilda", "#FFB6C1"), // Light Pink
  createNewDoctor("Claude", "#FAFAD2"), // Light Yellow
  createNewDoctor("Lysithea", "#DDA0DD"), // Plum
  createNewDoctor("Dimitri", "#87CEEB"), // Sky Blue
  createNewDoctor("Edelgard", "#DCDCDC"), // Gainsboro
  createNewDoctor("Petra", "#90EE90"), // Light Green
  createNewDoctor("Felix", "#FFDAB9"), // Peach Puff
  createNewDoctor("Marianne", "#B0C4DE"), // Light Steel Blue
  createNewDoctor("Caspar", "#E9967A"), // Light Coral
  createNewDoctor("Ingrid", "#B0E0E6"), // Powder Blue
];
