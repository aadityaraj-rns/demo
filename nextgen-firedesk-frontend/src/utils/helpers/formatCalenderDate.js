export const formatCalenderDate = (date) => {
  if (!date) return ""; // Handle null or undefined
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
  const day = String(d.getDate()).padStart(2, "0"); // Ensure 2-digit day
  return `${year}-${month}-${day}`;
};
