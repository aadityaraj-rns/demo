import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";

import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import ParentCard from "../../../components/shared/ParentCard";
import Spinner from "../../admin/spinner/Spinner";
import { formatDate } from "../../../utils/helpers/formatDate";
import { getMyCategories } from "../../../api/organization/internal";
import EditCategory from "../../../components/customer/categories/EditCategory";
import CategoryHistory from "../../../components/customer/categories/CategoryHistory";
import { MoreVert } from "@mui/icons-material";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Categories Table",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };
  const fetchCategories = async () => {
    const response = await getMyCategories();
    if (response.status === 200) {
      setCategories(response.data?.categories.categories);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer
      title="Categories"
      description="This is the Manager Table page"
    >
      <Breadcrumb title="Categories" items={BCrumb} />

      <ParentCard>
        <Box>
          <Paper variant="outlined">
            <TableContainer>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow sx={{ textTransform: "uppercase" }}>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "10px 4px",
                        borderLeft: "1px solid",
                      }}
                      colSpan={2}
                      align="center"
                    >
                      Current Service Period
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "10px 4px",
                        borderLeft: "1px solid",
                      }}
                      colSpan={3}
                      align="center"
                    >
                      Service Frequency
                    </TableCell>
                    <TableCell sx={{ borderLeft: "1px solid" }}></TableCell>
                  </TableRow>
                  <TableRow sx={{ textTransform: "uppercase" }}>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "10px 4px",
                      }}
                    >
                      Sl No
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "10px 4px",
                      }}
                    >
                      Category Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "16px 4px",
                      }}
                    >
                      From
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "16px 4px",
                      }}
                    >
                      To
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "16px 4px",
                      }}
                    >
                      Inspection
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "16px 4px",
                      }}
                    >
                      Testing
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "16px 4px",
                      }}
                    >
                      Maintenance
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        fontSize: "12px",
                        padding: "16px 4px",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          index % 2 === 0
                            ? "action.hover"
                            : "background.default",
                      }}
                    >
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {row.categoryId.categoryName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {row.serviceDetails?.startDate
                          ? formatDate(row.serviceDetails?.startDate)
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {row.serviceDetails?.endDate
                          ? formatDate(row.serviceDetails?.endDate)
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {row.serviceDetails?.serviceFrequency.inspection ?? "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {row.serviceDetails?.serviceFrequency.testing ?? "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        {row.serviceDetails?.serviceFrequency.maintenance ??
                          "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", padding: "6px 4px" }}>
                        <Tooltip title="View / Edit">
                          <IconButton onClick={(e) => handleMenuClick(e, row)}>
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) &&
                            currentRow?.categoryId._id === row.categoryId._id
                          }
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem>
                            <EditCategory
                              category={row}
                              onCategoryEdit={fetchCategories}
                            />
                          </MenuItem>
                          {row?.categoryHistory.length > 0 && (
                            <MenuItem>
                              <CategoryHistory history={row?.categoryHistory} />
                            </MenuItem>
                          )}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default Categories;
