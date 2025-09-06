import Swal from "sweetalert2";

export const showAlert = ({ text = "", icon = "success" }) => {
  return Swal.fire({
    icon,
    text,
    padding: "0.5em",
    customClass: {
      confirmButton: "orange-btn",
      popup: "sweet-alerts",
    },
  });
};
