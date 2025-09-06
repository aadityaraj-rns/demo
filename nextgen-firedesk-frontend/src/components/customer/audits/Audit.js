import ImageOrFileModal from "../../../components/modal/ImageOrFileModal";
import DataTable from "../../common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import AddAudit from "../../../pages/customer/audits/AddAudit";
import PropTypes from "prop-types";

const columns = [
  {
    id: "nameOfAudit",
    label: "Audit Name",
    sortable: true,
    render: (row) => (
      <span
        style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}
        onClick={() => document.getElementById(`modal-${row.id}`).click()}
      >
        {row.nameOfAudit}
      </span>
    ),
  },
  { id: "auditorName", label: "Auditor Name", sortable: true },
  { id: "description", label: "Description", sortable: true },
  {
    id: "createdAt",
    label: "Audit Date",
    sortable: true,
    render: (row) => formatDate(row.createdAt),
  },
  {
    id: "imageorfile",
    label: "Attachment",
    sortable: false,
    render: (row) => <ImageOrFileModal product={row} id={`modal-${row.id}`} />,
  },
];

const Audit = ({ audits, fetchaudits, setAddToaster }) => {
  return (
    <DataTable
      model={
        <AddAudit onAuditAdded={fetchaudits} setAddToaster={setAddToaster} />
      }
      data={audits}
      columns={columns}
      isFilter={true}
    />
  );
};
Audit.propTypes = {
  audits: PropTypes.array,
  fetchaudits: PropTypes.any,
  setAddToaster: PropTypes.any,
};

export default Audit;
