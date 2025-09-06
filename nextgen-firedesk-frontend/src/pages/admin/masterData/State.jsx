import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Chip,
} from "@mui/material";

import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import ParentCard from "../../../components/shared/ParentCard";
import StateAdd from "../../../components/admin/masterData/state/StateAdd";
import { getAllState } from "../../../api/admin/internal";
import StateEdit from "../../../components/admin/masterData/state/StateEdit";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "State Table",
  },
];

const State = () => {
  const [stateDatas, setStateDatas] = useState([]);

  const fetchStates = async () => {
    const response = await getAllState();
    if (response.status === 200) {
      setStateDatas(response.data.allState);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <PageContainer title="State" description="this is State Table page">
      {/* breadcrumb */}
      <Breadcrumb title="State" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard>
        <StateAdd onStateAdded={fetchStates} />
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
                    <Typography variant="h6">State Name</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">Action</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateDatas.map((state, index) => (
                  <TableRow key={state._id}>
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
                        {state.stateName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        sx={{
                          bgcolor:
                            state.status === "Active"
                              ? (theme) => theme.palette.success.light
                              : state.status === "Pending"
                              ? (theme) => theme.palette.warning.light
                              : state.status === "Active"
                              ? (theme) => theme.palette.primary.light
                              : state.status === "Deactive"
                              ? (theme) => theme.palette.error.light
                              : (theme) => theme.palette.secondary.light,
                          color:
                            state.status === "Active"
                              ? (theme) => theme.palette.success.main
                              : state.status === "Pending"
                              ? (theme) => theme.palette.warning.main
                              : state.status === "Active"
                              ? (theme) => theme.palette.primary.main
                              : state.status === "Deactive"
                              ? (theme) => theme.palette.error.main
                              : (theme) => theme.palette.secondary.main,
                          borderRadius: "8px",
                        }}
                        size="small"
                        label={state.status}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        <StateEdit onStateEdit={fetchStates} state={state} />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
};

export default State;
