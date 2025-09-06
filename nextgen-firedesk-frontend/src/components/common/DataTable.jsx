import { useState } from "react";
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
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { IconFilter, IconSearch } from "@tabler/icons";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css"; // Ensure rsuite styles are imported
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
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

const DataTable = ({ data = [], columns = [], isFilter, model }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [dateRange, setDateRange] = useState([null, null]); // Holds start and end date

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const comparator = (a, b, orderBy) => {
    if (!a[orderBy] || !b[orderBy]) return 0;
    if (b[orderBy] < a[orderBy]) return order === "asc" ? -1 : 1;
    if (b[orderBy] > a[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  };

  const stableSort = (array, comparator) => {
    if (!Array.isArray(array)) return []; // Prevents crash if array is undefined
    const stabilizedArray = array.map((el, index) => [el, index]);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  };

  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
  };

  const filteredData = data
    ?.filter((row) => {
      return columns?.some((col) => {
        const value = row[col.id];
        if (value && typeof value === "string") {
          return value?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (value && typeof value === "number") {
          return value?.toString().includes(searchTerm);
        }
        return false;
      });
    })
    ?.filter((row) => {
      if (!row.createdAt) return true;

      const createdAtDate = new Date(row.createdAt);
      if (isNaN(createdAtDate.getTime())) {
        console.warn("Invalid date:", row.createdAt);
        return false;
      }

      if (
        dateRange[0] &&
        createdAtDate < new Date(dateRange[0]).setHours(0, 0, 0, 0)
      )
        return false;
      if (
        dateRange[1] &&
        createdAtDate > new Date(dateRange[1]).setHours(23, 59, 59, 999)
      )
        return false;
      return true;
    });

  const sortedData = stableSort(filteredData, (a, b) =>
    comparator(a, b, orderBy)
  );

  const displayedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box mx={1}>
      {/* Search and Filter */}
      <Box
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            size="small"
            onChange={handleSearchChange}
            value={searchTerm}
          />
          {/* Date Range Picker with Single Calendar */}
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
          {isFilter && (
            <Tooltip title="Filter list" sx={{ ml: 2 }}>
              <IconButton onClick={toggleFilterModal}>
                <IconFilter size="1.2rem" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box>{model}</Box>
      </Box>
      <Paper variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
        <TableContainer
          sx={{
            overflow: "auto",
            maxHeight: 440,
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
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow className="text-nowrap">
                <TableCell sx={{ fontWeight: "600", fontSize: "0.7rem" }}>
                  SL NO
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{ fontWeight: "600", fontSize: "0.7rem" }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleRequestSort(col.id)}
                      >
                        {col.label?.toUpperCase()}
                      </TableSortLabel>
                    ) : (
                      col.label?.toUpperCase()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.length > 0 ? (
                displayedData.map((row, index) => (
                  <TableRow key={row._id || index}>
                    <TableCell sx={{ fontSize: "0.7rem", py: 0 }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                          py: 0,
                        }}
                      >
                        {col.render ? col.render(row) : row[col.id] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ fontSize: "0.7rem" }}
          component={Box}
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
DataTable.propTypes = {
  data: PropTypes.any,
  columns: PropTypes.any,
  isFilter: PropTypes.any,
  model: PropTypes.any,
};

export default DataTable;
