import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { Grid, Typography } from "@mui/material";
import { getMyAssets } from "../../../api/technician/internal";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helpers/formatDate";
import ParentCard from "../../../components/shared/ParentCard";
import DataTable from "../../../components/common/DataTable";

const BCrumb = [
  {
    to: "/technician",
    title: "Home",
  },
  {
    title: "my-assets",
  },
];

const MyAssets = () => {
  const [assets, setAssets] = useState([]);
  const technicianUserId = useSelector((state) => state.user._id);

  useEffect(() => {
    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyAssets(technicianUserId);
      if (response.status === 200) {
        setAssets(response.data.myAssets);
      }
    };
    fetchData();
  }, [technicianUserId]);

  const columns = [
    {
      id: "assetId",
      label: "assetId",
      render: (row) => (
        <Typography
          component={Link}
          to={`/technician/asset/${row._id}`}
          sx={{ color: "blue", textDecoration: "none" }}
        >
          {row.assetId}
        </Typography>
      ),
      sortaable: true,
    },
    {
      id: "productName",
      label: "Product Name",
      render: (row) => row.productId.productName,
      sortable: false,
    },
    {
      id: "plantName",
      label: "plant Name",
      render: (row) => row.plantId.plantName,
      sortable: false,
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => (row.createdAt ? formatDate(row.createdAt) : ""),
    },
  ];

  return (
    <PageContainer title="Assets" description="this is Assets page">
      <Breadcrumb title="Assets" items={BCrumb} />
      <Grid container spacing={3}>
        <ParentCard>
          <DataTable data={assets} columns={columns} isFilter={true} />
        </ParentCard>
      </Grid>
    </PageContainer>
  );
};

export default MyAssets;
