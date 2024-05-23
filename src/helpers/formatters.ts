export const formatHour = (hour: number) => {
  if (hour % 1 != 0) {
    return "";
  }
  if (hour === 0) {
    return "12:00 AM"
  } else if (hour < 12) {
    return `${hour}:00 AM`
  } else if (hour === 12) {
    return "12:00 PM"
  } else {
    return `${(hour % 12).toString()}:00 PM`
  }
}