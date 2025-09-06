import React, { useEffect, useState } from "react";
import Spinner from "../../../../pages/admin/spinner/Spinner";
import { getAssetsByOrgUserId } from "../../../../api/admin/internal";
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
import { format } from "date-fns";

const AssetDetails = ({ orgUserId }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAssetsByOrgUserId(orgUserId);
        if (response.status === 200) {
          setAssets(response.data.assets);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgUserId]);
  if (loading) {
    return <Spinner />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

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
                <Typography variant="h6">Asset Id</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Plant Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Product Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Next Service Date</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets?.map((asset, index) => (
              <TableRow key={asset._id}>
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
                    {asset._id || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {asset.plantId?.plantName || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {asset.productId?.productName || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {formatDate(asset.nextServiceDate) || "N/A"}
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

export default AssetDetails;
