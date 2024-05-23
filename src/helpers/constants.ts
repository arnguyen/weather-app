export const days = [
  {
    value: "Sunday",
    label: "Sunday",
  },
  {
    value: "Monday",
    label: "Monday",
  },
  {
    value: "Tuesday",
    label: "Tuesday",
  },
  {
    value: "Wednesday",
    label: "Wednesday",
  },
  {
    value: "Thursday",
    label: "Thursday",
  },
  {
    value: "Friday",
    label: "Friday",
  },
  {
    value: "Saturday",
    label: "Saturday",
  },
];

export const timeOfDay = [
  {
    value: "Morning",
    label: "Morning",
  },
  {
    value: "Afternoon",
    label: "Afternoon",
  },
  {
    value: "Evening",
    label: "Evening",
  },
];

export const keyToLabel: { [key: string]: string } = {
  temp: "Temperature in Fahrenheit",
  precipprob: "% chance of precipitation",
  windspeed: "Windspeed in mph"
}

// Colors chosen to be accessible
// https://venngage.com/tools/accessible-color-palette-generator with #FF0000 (red) as base
export const colors: { [key: string]: string } = {
  temp: "#ff0000",
  precipprob: "#000fcc",
  windspeed: "#00cf30"
}

export const sizes = {
  mobile: "480px",
  table: "768px",
  laptop: "1024px",
}

export const intToDay = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
}
