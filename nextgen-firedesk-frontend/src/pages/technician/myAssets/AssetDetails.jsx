import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import ChildCard from "../../../components/shared/ChildCard";
import AssetCarousel from "../../../components/technician/my-assets/AssetCarousel";
import { getAssetDetails } from "../../../api/technician/internal";
import { useParams } from "react-router-dom";
import Spinner from "../../admin/spinner/Spinner";
import { formatDate } from "../../../utils/helpers/formatDate";
import { IconCalendarEvent } from "@tabler/icons";

const BCrumb = [
  {
    to: "/technician",
    title: "Home",
  },
  {
    title: "Assets",
    to: "/technician/my-assets",
  },
  {
    title: "Asset detail",
  },
];

const AssetDetails = () => {
  const { assetId } = useParams();
  const [assetDetails, setAssetDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assetId) {
      const fetchData = async () => {
        const response = await getAssetDetails(assetId);
        if (response.status === 200) {
          setAssetDetails(response.data.asset);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [assetId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer
      title="Asset Details"
      description="this is Asset Details page"
    >
      <Breadcrumb title="Asset Detail" items={BCrumb} />
      <Grid
        container
        spacing={3}
        sx={{ maxWidth: { lg: "1055px", xl: "1200px" } }}
      >
        <Grid item xs={12} sm={12} lg={12}>
          <ChildCard>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={6}>
                {assetDetails && assetDetails.productId && (
                  <AssetCarousel
                    SliderData={[
                      assetDetails.productId.image1,
                      assetDetails.productId.image2,
                    ]}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <Box display="flex" alignItems="center">
                  <Chip
                    label={assetDetails.status}
                    color="success"
                    size="small"
                  />
                  <Typography
                    color="textSecondary"
                    variant="caption"
                    ml={1}
                    textTransform="capitalize"
                  >
                    {assetDetails.assetId}
                  </Typography>
                </Box>
                <Typography fontWeight="600" variant="h4" mt={1}>
                  Name: {assetDetails.productId.productName}
                </Typography>
                <Stack direction="row" gap={2} alignItems="center" pb={3}>
                  <Stack direction="column" mr="auto" alignItems="flex-start">
                    <Typography mt={2} variant="h6" fontWeight={600}>
                      <IconCalendarEvent className="pe-1" />
                      MFD: {formatDate(assetDetails.manufacturingDate)}
                    </Typography>
                  </Stack>
                  <Stack direction="column" mr="auto" alignItems="flex-start">
                    <Typography mt={2} variant="h6" fontWeight={600}>
                      <IconCalendarEvent className="pe-1" />
                      MFD: {formatDate(assetDetails.manufacturingDate)}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider sx={{ borderColor: "gray", borderWidth: 1, my: 2 }} />
                <Stack pt={2} direction="row" alignItems="center">
                  <Typography variant="h6" mr={1}>
                    Type:
                  </Typography>
                  <Box>{assetDetails.productId.type}</Box>
                </Stack>
                <Stack pt={2} direction="row" alignItems="center">
                  <Typography variant="h6" mr={1}>
                    Test Frequency:
                  </Typography>
                  <Box>{assetDetails.productId.testFrequency}</Box>
                </Stack>
                <Stack pt={2} direction="row" alignItems="center">
                  <Typography variant="h6" mr={1}>
                    Capacity:
                  </Typography>
                  <Box>{assetDetails.productId.capacity}</Box>
                </Stack>
              </Grid>
            </Grid>
          </ChildCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AssetDetails;
