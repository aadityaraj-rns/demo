import { useEffect, useState } from "react";
// import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
// import ParentCard from "../../../components/shared/ParentCard";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getAssetById } from "../../../api/organization/internal";
import { formatDate } from "../../../utils/helpers/formatDate";

const AssetDetail = () => {
  const { assetId } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    const response = await getAssetById(assetId);
    if (response.status === 200) {
      setAssetData(response.data.asset);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);
  const downloadQRCode = async () => {
    try {
      const response = await fetch(assetData.qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `QRCode_${assetData.productId.productName}.png`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  // const BCrumb = [
  //   {
  //     to: "/customer",
  //     title: "Home",
  //   },
  //   {
  //     to: "/customer/assets",
  //     title: "Assets",
  //   },
  //   {
  //     title: "Asset Detail",
  //   },
  // ];
  return (
    <PageContainer
      title="Assests Detail"
      description="this is Assest Details page"
    >
      {/* breadcrumb */}
      {/* <Breadcrumb title="Assests" items={BCrumb} /> */}
      {/* end breadcrumb */}
      {loading ? (
        <div>Loading ..</div>
      ) : (
        <Paper variant="outlined" sx={{ paddingLeft: 2 }}>
          <Typography variant="h6">Asset Details</Typography>
          {assetData ? (
            <>
              <div className="row">
                <div className="col-3">
                  <Grid container spacing={2} mt={2}>
                    <Grid item sm={12}>
                      <Typography variant="h6">Image 1</Typography>
                      <img
                        src={assetData.productId.image1}
                        alt="img"
                        className="img-fluid"
                      />
                    </Grid>
                    <Grid item sm={12}>
                      <Typography variant="h6">Image 2</Typography>
                      <img
                        src={assetData.productId.image2}
                        alt="img"
                        className="img-fluid"
                      />
                    </Grid>
                    <Grid item sm={12} style={{ textAlign: "center" }}>
                      <img
                        src={assetData && assetData.qrCodeUrl}
                        alt="img"
                        style={{ height: "70px", width: "70px" }}
                        className="img-fluid"
                      />
                    </Grid>

                    <Grid item sm={12} style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={downloadQRCode}
                      >
                        Download QR Code
                      </Button>
                    </Grid>
                  </Grid>
                </div>
                <div className="col-9">
                  <Grid container spacing={2} mt={2} ml={2}>
                    <Grid item sm={12} className="border-bottom">
                      <Typography variant="h5">
                        Product information :
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Product Category:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.categoryId.categoryName}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Asset ID:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.assetId}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Location:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {/* {assetData.building} */}
                        </span>
                      </Typography>
                    </Grid>

                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Plant Name:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.plantId.plantName}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Building Name:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.building}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className="mt-3" ml={2}>
                    <Grid item sm={12} className="border-bottom">
                      <Typography variant="h5">Technician Details</Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Name:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.technicianUserId.name}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Contact:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.technicianUserId.phone}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Email:
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.technicianUserId.email}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className="mt-3" ml={2}>
                    <Grid item sm={12} className="border-bottom">
                      <Typography variant="h5">
                        Product Specification :
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Name:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.productName}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Type:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.type}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Test Frequency:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.testFrequency}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Capacity:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.capacity}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Manufacturer Name:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.manufacturerName}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Description:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.productId.description}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className="mt-3" ml={2}>
                    <Grid item sm={12} className="border-bottom">
                      <Typography variant="h5">Other Asset Details</Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Model:
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.model}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        SlNo:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.slNo}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Pressure Rating:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.pressureRating}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Moc:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.moc}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Approval:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.approval}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Fire Class:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.fireClass}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Manufacturing Date:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {formatDate(assetData.manufacturingDate)}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Install Date:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {formatDate(assetData.installDate)}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Valid Till:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {formatDate(assetData.validTill)}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Suction Size:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.suctionSize}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Head:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.head}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Rpm:
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.rpm}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Moc Of Impeller:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.mocOfImpeller}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Fuel Capacity:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.fuelCapacity}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Moc Of Impeller:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.mocOfImpeller}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Health Status:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.healthStatus}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography variant="h6">
                        Tag:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {assetData.tag}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </>
          ) : (
            <p>No data found.</p>
          )}
        </Paper>
      )}
    </PageContainer>
  );
};

export default AssetDetail;
