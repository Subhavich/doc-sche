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

export const MOCKDOCSFULL = [
  createNewDoctor("Byleth", "#ADD8E6"),
  createNewDoctor("Hilda", "#FFC0CB"),
  createNewDoctor("Claude", "#FFFACD"),
  createNewDoctor("Lysithea", "#DDA0DD"),
  createNewDoctor("Dimitri", "#87CEEB"),
  createNewDoctor("Edelgard", "#DCDCDC"),
  createNewDoctor("Petra", "#90EE90"),
  createNewDoctor("Felix", "#FFDAB9"),
  createNewDoctor("Ingrid", "#E0FFFF"),
  createNewDoctor("Bernadetta", "#E6E6FA"),
  createNewDoctor("Dorothea", "#F5DEB3"),
  createNewDoctor("Hubert", "#A9A9A9"),
];
