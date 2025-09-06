import { useEffect, useState } from "react";
import { getLapsedServices } from "../../../api/organization/internal";
import Spinner from "../../../pages/admin/spinner/Spinner";
import { formatDate } from "../../../utils/helpers/formatDate";
import { Link } from "react-router-dom";
import AssetDataTable from "../../common/AssetDataTable";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { SaveAltOutlined } from "@mui/icons-material";

const LapsedService = () => {
  const [lapsedServices, setLapsedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const response = await getLapsedServices();
    if (response.status == 200) {
      setLapsedServices(response.data?.lapsedService);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
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
      getFilterValue: (row) => row?.assetId,
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
            row?.assetsId.flatMap((a) => a?.technicianUserId.map((t) => t?.name))
          ),
        ].join(", "),
      sortable: true,
    },
  ];

  const handleFilteredDataChange = (filteredData) => {
    setFilteredDatas(filteredData);
  };

  const handleDownloadExcel = () => {
    const downloadData =
      filteredDatas.length > 0 ? filteredDatas : lapsedServices;

    const worksheetData = [
      [
        "Asset ID",
        "Plant",
        "Building",
        "Location",
        "Asset",
        "Service Date",
        "Service Type",
        "Technician",
        "Status",
      ],
      ...downloadData.map((asset) => [
        asset?.assetId?.assetId,
        asset?.plantId?.plantName,
        asset?.assetId?.building,
        asset?.assetId?.location,
        asset?.assetId.productId.productName,
        formatDate(asset?.createdAt),
        asset?.serviceType,
        asset?.technicianUserId?.name,
        asset?.status,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

    XLSX.writeFile(workbook, "LapsedService.xlsx");
  };

  return (
    <AssetDataTable
      data={lapsedServices}
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

export default LapsedService;
