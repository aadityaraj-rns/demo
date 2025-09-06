import React from "react";
import DashboardCard from "../shared/DashboardCard";
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
  Select,
} from "@mui/material";

import img1 from "src/assets/images/products/s6.jpg";
import img4 from "src/assets/images/products/s4.jpg";

const ProductPerformances = () => {
  // for select
  const [month, setMonth] = React.useState("1");

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <DashboardCard
      title="Latest Services/Tickets"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          size="small"
          value={month}
          onChange={handleChange}
        >
          <MenuItem value={1}>Jan 2023</MenuItem>
          <MenuItem value={2}>Dec 2023</MenuItem>
          <MenuItem value={3}>Nov 2023</MenuItem>
        </Select>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Technician Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Service Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 1 */}
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={img4}
                    variant="rounded"
                    alt={img1}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Technician Name
                    </Typography>
                    <Typography
                      color="textSecondary"
                      fontSize="12px"
                      variant="subtitle2"
                    >
                      Service Location
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  fontWeight={400}
                >
                  Service Name
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  sx={{
                    bgcolor: (theme) => theme.palette.error.light,
                    color: (theme) => theme.palette.error.main,
                    borderRadius: "6px",
                    width: 80,
                  }}
                  size="small"
                  label="Pending"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default ProductPerformances;
