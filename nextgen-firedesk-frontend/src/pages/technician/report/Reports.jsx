import React from "react";
import ParentCard from "../../../components/shared/ParentCard";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import { Box, Chip } from "@mui/material";

const Reports = ({ reports }) => {
  if (!reports || !reports.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        No Data
      </Box>
    );
  }

  const searchableFields = ["serviceType"];
  const columns = [
    {
      id: "serviceType",
      label: "Service Type",
      sortable: true,
    },
    {
      id: "assetId",
      label: "assetId",
      render: (row) => row.assetId.assetId,
      sortaable: false,
    },
    {
      id: "managerRemark",
      label: "Manager Remark",
      sortable: false,
    },

    {
      id: "statusUpdatedAt",
      label: "Status Updated At",
      sortable: false,
      render: (row) =>
        row.statusUpdatedAt ? formatDate(row.statusUpdatedAt) : "",
    },
    {
      id: "statusUpdatedBy",
      label: "Status Updated By",
      sortable: false,
      render: (row) => row.statusUpdatedBy?.name,
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => (row.createdAt ? formatDate(row.createdAt) : ""),
    },
    {
      id: "status",
      label: "Status",
      sortable: false,
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
  ];
  return (
    <ParentCard>
      <DataTable
        data={reports}
        columns={columns}
        searchableFields={searchableFields}
        isFilter={true}
      />
    </ParentCard>
  );
};

export default Reports;
