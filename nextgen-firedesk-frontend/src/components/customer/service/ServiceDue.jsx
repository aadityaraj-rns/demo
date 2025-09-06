import { useEffect, useState } from "react";
import { getAllServiceDue } from "../../../api/organization/internal";
import Spinner from "../../../pages/admin/spinner/Spinner";
import { format } from "date-fns";
import AssetDataTable from "../../common/AssetDataTable";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { SaveAltOutlined } from "@mui/icons-material";

const ServiceDue = () => {
  const [serviceDue, setServiceDue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDatas, setFilteredDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllServiceDue();
      if (response.status === 200) {
        setServiceDue(response?.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy");
  };

  if (loading) {
    return <Spinner />;
  }
  const columns = [
    {
      id: "groupId",
      label: "Group",
      sortable: true,
      render: (row) => (
        <Link to={`/customer/group-service`} sx={{ color: "blue" }}>
          {row.groupServiceId?.groupId}
        </Link>
      ),
      getFilterValue: (row) => row?.groupServiceId?.groupId,
    },
    {
      id: "assetId",
      label: "Asset Id",
      sortable: true,
      render: (row) => (
        <Link to={`/customer/assets`} sx={{ color: "blue" }}>
          <strong>{row?.assetsId?.map((a) => a.assetId).join(", ")}</strong>
        </Link>
      ),
      getFilterValue: (row) => row?.assetsId?.map((a) => a.assetId).join(", "),
    },
    {
      id: "plantName",
      label: "plant",
      render: (row) => row?.plantId?.plantName,
      sortable: true,
    },
    {
      id: "building",
      label: "building",
      render: (row) =>
        [...new Set(row?.assetsId.map((a) => a?.building))].join(", "),
      sortable: true,
    },
    {
      id: "location",
      label: "location",
      render: (row) =>
        [...new Set(row?.assetsId.map((a) => a?.location))].join(", "),
      sortable: true,
    },
    {
      id: "assetName",
      label: "asset",
      render: (row) =>
        [...new Set(row?.assetsId.map((a) => a?.productId?.productName))].join(
          ", "
        ),
      sortable: true,
    },
    {
      id: "createdAt",
      label: "Service Due",
      sortable: true,
      render: (row) => formatDate(row?.date),
    },

    {
      id: "serviceType",
      label: "Service Type",
      sortable: true,
    },
    {
      id: "serviceFrequency",
      label: "Frequency",
      sortable: true,
    },
    {
      id: "technicianName",
      label: "Technician",
      render: (row) =>
        [
          ...new Set(
            row?.assetsId.flatMap((a) =>
              a?.technicianUserId.map((t) => t?.name)
            )
          ),
        ].join(", "),
      sortable: true,
    },
  ];

  const handleFilteredDataChange = (filteredData) => {
    setFilteredDatas(filteredData);
  };

  const handleDownloadExcel = () => {
    const downloadData = filteredDatas.length > 0 ? filteredDatas : serviceDue;

    const worksheetData = [
      [
        "Group",
        "Asset ID",
        "Plant",
        "Building",
        "Location",
        "Asset",
        "Service Due",
        "Service Type",
        "Service Frequency",
        "Technician",
      ],
      ...downloadData.map((asset) => [
        asset?.groupServiceId?.groupId,
        asset?.assetsId?.map((a) => a.assetId).join(", "),
        asset?.plantId?.plantName,
        [...new Set(asset?.assetsId.map((a) => a?.building))].join(", "),
        [...new Set(asset?.assetsId.map((a) => a?.location))].join(", "),
        [
          ...new Set(asset?.assetsId.map((a) => a?.productId?.productName)),
        ].join(", "),
        formatDate(asset?.date),
        asset?.serviceType,
        asset?.serviceFrequency,
        [
          ...new Set(
            asset?.assetsId.flatMap((a) =>
              a?.technicianUserId.map((t) => t?.name)
            )
          ),
        ].join(", "),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

    XLSX.writeFile(workbook, "Upcoming.xlsx");
  };

  return (
    <AssetDataTable
      data={serviceDue}
      columns={columns}
      isFilter={true}
      onFilterChange={handleFilteredDataChange}
      modal={
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveAltOutlined />}
          onClick={handleDownloadExcel}
        >
          Download
        </Button>
      }
    />
  );
};

export default ServiceDue;
