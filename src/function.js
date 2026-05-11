export function isDateInFuture(dateString) {
  if (!dateString) return;
  const [day, month, year] = dateString.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);

  const currentDate = new Date();

  return inputDate > currentDate;
}
