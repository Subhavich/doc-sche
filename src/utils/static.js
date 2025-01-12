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
  createNewDoctor("Dr. 1", "#F4D03F"), // Yellow
  createNewDoctor("Dr. 2", "#E74C3C"), // Red
  createNewDoctor("Dr. 3", "#8E44AD"), // Purple
  createNewDoctor("Dr. 4", "#2196F3"), // Blue
  createNewDoctor("Dr. 5", "#43A047"), // Green
  createNewDoctor("Dr. 6", "#FA983A"), // Orange
  createNewDoctor("Dr. 7", "#F06292"), // Pink
  createNewDoctor("Dr. 8", "#42A5F5"), // Light Blue
  createNewDoctor("Dr. 9", "#9CCC65"), // Lime Green
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

export const tailwindHexColors = [
  "#F4D03F",
  "#F5B041",
  "#FA983A",
  "#E67E22",
  "#D35400",
  "#CA6F1E",
  "#E74C3C",
  "#C0392B",
  "#FF5C5C",
  "#F06292",
  "#E91E63",
  "#FF80AB",
  "#8E44AD",
  "#7E57C2",
  "#AB47BC",
  "#5C6BC0",
  "#2196F3",
  "#42A5F5",
  "#1565C0",
  "#26A69A",
  "#00796B",
  "#43A047",
  "#66BB6A",
  "#9CCC65",
  "#2E7D32",
  "#00897B",
  "#00ACC1",
];
