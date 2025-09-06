import { Typography, Fab } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSelfAudits } from "../../../api/organization/internal";
import DataTable from "../../common/DataTable";
import Spinner from "../../../pages/admin/spinner/Spinner";
import { IconEye } from "@tabler/icons";

const SelfAudit = () => {
  const [selfAudits, setSelfAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelfAuditQs = async () => {
      const response = await getSelfAudits();
      if (response.status === 200) {
        setSelfAudits(response.data);
        setLoading(false);
      }
    };
    fetchSelfAuditQs();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const columns = [
    {
      id: "formattedDate",
      label: "Date",
      sortable: true,
      render: (row) => {
        const formattedDate = new Date(row.createdAt)
          .toISOString()
          .split("T")[0];
        return (
          <Typography variant="h6" fontWeight="400">
            {formattedDate}
          </Typography>
        );
      },
    },
    {
      id: "workPlace",
      label: "Work Place Name",
      render: (row) => (
        <Link to={`${row._id}`} style={{ color: "inherit" }}>
          {row.workPlace}
        </Link>
      ),
    },
    { id: "inspectorName", label: "Inspector Name" },
    {
      id: "marks",
      label: "Marks",
      sortable: false,
      render: (row) => {
        if (row.marks !== undefined && row.totalQuestions !== undefined) {
          return (
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {row.marks}/{row.totalQuestions}
            </Typography>
          );
        }
        return null;
      },
    },
    {
      id: "response",
      label: "Response",
      sortable: true,
      render: (row) => (
        <Link to={`${row._id}`}>
          <Fab size="small" color="primary">
            <IconEye size="16" />
          </Fab>
        </Link>
      ),
    },
  ];

  // const searchableFields = ["inspectorName", "workPlace"];

  return (
    <DataTable
      data={selfAudits}
      columns={columns}
      // searchableFields={searchableFields}
      isFilter={true}
    />
  );
};

export default SelfAudit;
