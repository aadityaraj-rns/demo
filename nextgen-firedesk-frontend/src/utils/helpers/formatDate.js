import { format } from "date-fns";

export const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (isNaN(date)) {
    return "";
  }

  return format(date, "dd-MM-yyyy");
};
