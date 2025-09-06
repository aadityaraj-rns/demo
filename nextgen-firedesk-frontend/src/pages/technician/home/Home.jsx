import {
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BlankCard from "../../../components/shared/BlankCard";
import { getMyPlants } from "../../../api/technician/internal";
import { useSelector } from "react-redux";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  {
    title: "Home",
  },
];

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [myCategory, setMyCategory] = useState("");
  const [isLoading, setLoading] = useState(true);
  const technicianUserId = useSelector((state) => state.user._id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyPlants(technicianUserId);
      if (response.status === 200) {
        setPlants(response.data?.plants);
        setMyCategory(response.data?.category?.categoryName);
      }
    };
    fetchData();
  }, []);
  return (
    <PageContainer title="Home" description="this is Home page">
      <Breadcrumb title="Home" items={BCrumb} />
      <Typography variant="h4" textAlign="center">
        CATEGORY:&nbsp;&nbsp; {myCategory}
      </Typography>
      <Grid container spacing={3} justifyContent="space-around">
        {plants.map((plant, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <BlankCard className="hoverCard">
              <>
                {/* <Typography
                  component={Link}
                  to={`/technician/plant/${plant._id}`}
                  sx={{ color: "inherit", textDecoration: "none" }}
                > */}
                {isLoading ? (
                  <Skeleton
                    variant="square"
                    animation="wave"
                    width="100%"
                    height={240}
                  ></Skeleton>
                ) : (
                  <CardMedia
                    component="img"
                    height="240"
                    style={{ objectFit: "contain" }}
                    image={plant.plantImage}
                    alt="green iguana"
                  />
                )}
                <CardContent>
                  <Stack direction="row" gap={3} alignItems="center">
                    <Stack direction="row" gap={1} alignItems="center">
                      <b>PLANT:</b>
                      &nbsp;&nbsp;{plant.plantName}
                    </Stack>

                    <Stack direction="row" ml="auto" alignItems="center">
                      <b>ADDRESS:</b>
                      &nbsp;&nbsp;{plant.address}
                    </Stack>
                  </Stack>
                </CardContent>
                {/* </Typography> */}
              </>
            </BlankCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default Home;
