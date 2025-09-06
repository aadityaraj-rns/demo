import ParentCard from "../../shared/ParentCard";
import DataTable from "../../common/DataTable";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helpers/formatDate";
import PropTypes from "prop-types";

const ServiceRecord = ({ services }) => {
  const columns = [
    { id: "serviceName", label: "Service Name", sortable: true },
    {
      id: "technicianName",
      label: "Service By",
      render: (row) => row.technicianUserId?.name,
      sortable: true,
    },

    { id: "serviceType", label: "service Type", sortable: false },
    {
      id: "createdAt",
      label: "created At",
      render: (row) => formatDate(row.createdAt),
      sortable: false,
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          label={row.status}
          sx={{
            bgcolor:
              row.status === "Approved"
                ? "success.light"
                : row.status === "Pending"
                ? "warning.light"
                : row.status === "Rejected"
                ? "error.light"
                : "secondary.light",
            color:
              row.status === "Approved"
                ? "success.main"
                : row.status === "Pending"
                ? "warning.main"
                : row.status === "Rejected"
                ? "error.main"
                : "secondary.main",
          }}
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      render: (row) => (
        <>
          {row.status != "Lapsed" && (
            <Link to={`/customer/service-details/view-form/${row._id}`}>
              {" "}
              view{" "}
            </Link>
          )}
        </>
      ),
    },
  ];

  return (
    <ParentCard>
      <DataTable data={services} columns={columns} isFilter={true} />
    </ParentCard>
  );
};
ServiceRecord.propTypes = {
  services: PropTypes.array,
};

export default ServiceRecord;
