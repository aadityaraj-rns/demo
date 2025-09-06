import React, { useEffect, useState } from "react";
import { getPlantsByOrgUserId } from "../../../../api/admin/internal";
import Spinner from "../../../../pages/admin/spinner/Spinner";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PlantView from "./PlantView";

const PlantDetails = ({ orgUserId }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlantsByOrgUserId(orgUserId);
        if (response.status === 200) {
          setPlants(response.data.plants);
        }
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgUserId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Sl No</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Plant Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Address</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">City Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Manager Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Plant View</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plants?.map((plant, index) => (
              <TableRow key={plant._id}>
                <TableCell align="center">
                  <Typography variant="h6" fontWeight="600">
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {plant.plantName || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {plant.address || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {plant.cityId?.cityName || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {plant.managerId?.userId?.name || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    <PlantView plant={plant} />
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlantDetails;
