import React, { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../../components/shared/ParentCard";
import { Chip, Box, Button } from "@mui/material";
import { getAllClients } from "../../../api/partner/internal";
import Toaster from "../../../components/toaster/Toaster";
import Spinner from "../../admin/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BCrumb = [
  {
    to: "/partner",
    title: "Home",
  },
  {
    title: "Reports",
  },
];

const Reports = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [addSuccess, setAddSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredClients, setFilteredClients] = useState([]);

  // const clientDetails = (userId) => {
  //   navigate(`/client/details/${userId}`);
  // };

  // const setAddToaster = async () => {
  //   setAddSuccess(true);
  //   setTimeout(() => setAddSuccess(false), 1500);
  // };
  // const setEditToaster = async () => {
  //   setEditSuccess(true);
  //   setTimeout(() => setEditSuccess(false), 1500);
  // };

  const fetchClients = async () => {
    const response = await getAllClients();
    if (response.status === 200) {
      setClients(response.data.clients);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchClients();
  }, []);

  // Function to download data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Sl No",
      "Login ID",
      "Client Name",
      "Contact No",
      "Created At",
    ];
    const tableRows = [];

    clients.forEach((client, index) => {
      const clientData = [
        index + 1,
        client.loginID,
        client.name,
        client.contactNo,
        formatDate(client.createdAt),
      ];
      tableRows.push(clientData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.5, // Border thickness
        lineColor: [200, 200, 200],
      },
      bodyStyles: {
        halign: "center",
        fillColor: (rowIndex) =>
          rowIndex % 2 === 0 ? [240, 240, 240] : [255, 255, 255], // Custom striped color
        lineWidth: 0.5, // Border thickness
        lineColor: [200, 200, 200],
      },
      theme: "grid", // This will work, but you can customize it further as above
      margin: { top: 20 },
    });
    doc.save("clients_data.pdf");
  };

  const columns = [
    { id: "loginID", label: "Login ID", sortable: true },
    { id: "name", label: "Client Name", sortable: true },
    {
      id: "categoryNames",
      label: "Category",
      sortable: false,
      render: (client) =>
        client.categoryNames && client.categoryNames.length > 0
          ? client.categoryNames.join(", ")
          : "-",
    },
    {
      id: "clientType",
      label: "Client Type",
      sortable: true,
      render: (client) =>
        client.clientType && client.clientType === "organization"
          ? "customer"
          : client.clientType,
    },
    { id: "cityName", label: "City", sortable: false },
    { id: "stateName", label: "State", sortable: false },
    { id: "contactNo", label: "Contact No", sortable: false },
    { id: "email", label: "Email", sortable: false },
    { id: "gst", label: "GST", sortable: false },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          label={row.status}
          sx={{
            bgcolor:
              row.status === "Active"
                ? "success.light"
                : row.status === "Pending"
                ? "warning.light"
                : row.status === "Deactive"
                ? "error.light"
                : "secondary.light",
            color:
              row.status === "Active"
                ? "success.main"
                : row.status === "Pending"
                ? "warning.main"
                : row.status === "Deactive"
                ? "error.main"
                : "secondary.main",
          }}
        />
      ),
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="Clients" description="this is Client Table page">
      <Breadcrumb title="Clients" items={BCrumb} />

      {/* Add Download Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Box>

      <ParentCard>
        <DataTable
          data={clients}
          columns={columns}
          // searchableFields={searchableFields}
          isFilter={true}
          onFilterDataChange={setFilteredClients}
        />
      </ParentCard>

      {addSuccess && (
        <Toaster
          title="Customer"
          message="Added successfully"
          color="success"
        />
      )}
      {editSuccess && (
        <Toaster
          title="Customer"
          message="Updated successfully"
          color="success"
        />
      )}
    </PageContainer>
  );
};

export default Reports;
