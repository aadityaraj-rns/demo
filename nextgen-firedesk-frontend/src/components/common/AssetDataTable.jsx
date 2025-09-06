import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Box,
  Chip,
  Autocomplete,
  TextField,
  Checkbox,
  IconButton,
  Tooltip,
  Popover,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { IconFilter } from "@tabler/icons";
import { DateRangePicker } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import "rsuite/dist/rsuite.min.css"; // Ensure rsuite styles are imported
import PropTypes from "prop-types";

const predefinedRanges = [
  { label: "Today", value: [new Date(), new Date()], placement: "left" },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
];

const AssetDataTable = ({ data, columns, isFilter, modal, onFilterChange }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [filterSelections, setFilterSelections] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumnId, setFilterColumnId] = useState("");
  const toggleFilterModal = () => setFilterModalOpen(!filterModalOpen);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]); // Holds start and end date

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (columnId, values) => {
    setFilterSelections({
      ...filterSelections,
      [columnId]: values,
    });
  };

  const handleFilterIconClick = (event, columnId) => {
    setAnchorEl(event.currentTarget);
    setFilterColumnId(columnId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setFilterColumnId("");
  };

  const comparator = (a, b) => {
    if (b[orderBy] < a[orderBy]) return order === "asc" ? -1 : 1;
    if (b[orderBy] > a[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedArray = array?.map((el, index) => [el, index]);
    stabilizedArray?.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray?.map((el) => el[0]);
  };

  const getDistinctValues = (columnId) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return [];

    const values = data.map((row) => {
      if (column.getFilterValue) {
        return column.getFilterValue(row); // Use plain text value for filtering
      }
      return column.render ? column.render(row) : row[columnId];
    });

    return Array.from(
      new Set(values.map((v) => (typeof v === "object" ? "-" : v)))
    );
  };

  const filteredData = data
    ?.filter((row) => {
      return columns.every((col) => {
        const selectedValues = filterSelections[col.id] || [];
        if (selectedValues.length === 0) return true;

        const cellValue = col.getFilterValue
          ? col.getFilterValue(row)
          : col.render
          ? col.render(row)
          : row[col.id];
        return selectedValues.includes(cellValue);
      });
    })
    .filter((row) => {
      const dateToCheck = row.createdAt
        ? new Date(row.createdAt)
        : row.serviceDate
        ? new Date(row.serviceDate)
        : null;

      if (!dateToCheck || isNaN(dateToCheck.getTime())) {
        console.warn("Skipping row due to invalid date:", row);
        return true;
      }

      const startDate = dateRange[0]
        ? new Date(dateRange[0]).setHours(0, 0, 0, 0)
        : null;
      const endDate = dateRange[1]
        ? new Date(dateRange[1]).setHours(23, 59, 59, 999)
        : null;

      if (startDate && dateToCheck < startDate) return false;
      if (endDate && dateToCheck > endDate) return false;

      return true;
    });

  const sortedData = stableSort(filteredData, comparator);

  const previousFilteredData = useRef(null);

  useEffect(() => {
    if (
      onFilterChange &&
      JSON.stringify(previousFilteredData.current) !==
        JSON.stringify(filteredData)
    ) {
      previousFilteredData.current = filteredData;
      onFilterChange(filteredData);
    }
  }, [filteredData, onFilterChange]);

  return (
    <>
      <Box mx={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isFilter && (
              <Tooltip title="Filter list" sx={{ mr: 2 }}>
                <IconButton onClick={toggleFilterModal}>
                  <IconFilter size="1.2rem" />
                </IconButton>
              </Tooltip>
            )}
            {filterModalOpen && (
              <DateRangePicker
                ranges={predefinedRanges}
                showOneCalendar
                value={dateRange}
                onChange={(range) => setDateRange(range || [null, null])}
                placeholder="Select Date Range"
                style={{ width: 300, marginLeft: 10 }}
                cleanable
              />
            )}
          </Box>

          <Box>{modal}</Box>
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
          <TableContainer
            sx={{
              maxHeight: 440,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#5d6330",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
              "-ms-overflow-style": "auto",
              "scrollbar-width": "thin",
              "scrollbar-color": "#888 #f1f1f1",
            }}
          >
            <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.7rem" }}>
                    SL NO
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sortDirection={orderBy === col.id ? order : false}
                      sx={{ whiteSpace: "nowrap", fontSize: "0.7rem" }}
                    >
                      <Box display="flex" alignItems="center">
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => handleRequestSort(col.id)}
                          sx={{
                            fontWeight:
                              filterSelections[col.id]?.length > 0
                                ? "bold"
                                : "normal",
                            color:
                              filterSelections[col.id]?.length > 0
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {col?.label?.toUpperCase()}
                        </TableSortLabel>
                        {col.filterable !== false && (
                          <IconButton
                            onClick={(event) =>
                              handleFilterIconClick(event, col.id)
                            }
                            size="small"
                          >
                            <ExpandMore />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index} sx={{ whiteSpace: "nowrap" }}>
                      <TableCell sx={{ fontSize: "0.7rem" }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.id} sx={{ fontSize: "0.7rem" }}>
                          {col.render ? col.render(row) : row[col.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedData?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 2, minWidth: "250px" }}>
            <Autocomplete
              multiple
              options={getDistinctValues(filterColumnId)}
              getOptionLabel={(option) => option}
              value={(filterSelections[filterColumnId] || []).map(
                (selectedValue) => selectedValue
              )}
              onChange={(event, newValue) =>
                handleFilterChange(filterColumnId, newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={`Filter ${
                    columns.find((col) => col.id === filterColumnId)?.label
                  }`}
                  fullWidth
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option}>
                  <Checkbox checked={selected} />
                  {option}
                </li>
              )}
            />
          </Box>
        </Popover>
      </Box>
    </>
  );
};

AssetDataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  isFilter: PropTypes.bool,
  modal: PropTypes.element,
  onFilterChange: PropTypes.func,
};

export default AssetDataTable;
