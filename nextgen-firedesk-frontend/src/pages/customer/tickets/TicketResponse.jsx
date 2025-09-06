import {
  fetchTicketResponse,
  updateServicesResponseStatus,
  updateTicketResponseStatus,
} from "../../../api/organization/internal"; // Added updateServicesResponseStatus
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../admin/spinner/Spinner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import Toaster from "../../../components/toaster/Toaster";
import "../services/Print.css";
import { IconPrinter } from "@tabler/icons";
import { formatDate } from "../../../utils/helpers/formatDate";

const TicketResponse = () => {
  const { responseId } = useParams();
  const [open, setOpen] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterProps, setToasterProps] = useState({});
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("");
  const [serviceResponse, setServiceResponse] = useState({});
  const [loading, setLoading] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handleClickOpen = (status) => {
    setStatus(status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApprove = () => {
    setOpen(false);
    approveServiceForm();
  };

  const approveServiceForm = async () => {
    const serviceId = serviceResponse._id; // Assuming serviceId is stored in serviceResponse
    const response = await updateTicketResponseStatus(
      serviceId,
      status,
      remark
    );
    if (response.status === 200) {
      fetchData();
      setToasterProps({
        title: "Service Form",
        message:
          status === "Completed"
            ? "Approved successfully"
            : "Rejected successfully",
        color: "success",
      });
      setShowToaster(true);
      setRemark("");
      setStatus("");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchTicketResponse(responseId);
      if (response.status === 200) {
        const ticketResponse = response.data.ticketResponse;
        // Convert image properties to an array
        const imageUrls = Object.values(ticketResponse.images || {}).filter(
          (value) => typeof value === "string" && value.startsWith("http")
        );
        setServiceResponse({
          ...ticketResponse,
          images: imageUrls,
        });
      }
    } catch (error) {
      console.error("Error fetching ticket response:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="ticket-form">
      {showToaster && (
        <Toaster
          title={toasterProps.title}
          message={toasterProps.message}
          color={toasterProps.color}
        />
      )}
      <h1 className="text-white bg-warning p-3 rounded text-center">
        Technician Response
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Service Person Name: {serviceResponse.technicianId.name}
            </th>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Date of Service: {formatDate(serviceResponse.updatedAt)}
            </th>
          </tr>
          <tr>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Company Name: {serviceResponse.technicianId.name}
            </th>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Report Number: {serviceResponse.ticketId.ticketId}-
              {serviceResponse.ticketReportNo}
            </th>
          </tr>
          <tr>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Asset ID: {serviceResponse.assetsId.assetId}
            </th>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Asset Location:{" "}
              {serviceResponse.plantId.plantName +
                " , " +
                serviceResponse.plantId.address +
                " , "}
            </th>
          </tr>
          <tr>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Service Type : On Demand
            </th>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Geo Check : {serviceResponse.geoCheck}
            </th>
          </tr>
          <tr>
            <th
              colSpan={6}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Asset Description:{" "}
              {serviceResponse.assetsId.productId.description}
            </th>
          </tr>
        </thead>
      </table>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <tbody>
          <tr>
            <th
              style={{
                width: "5%",
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              SL No
            </th>
            <th
              style={{
                width: "55%",
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Description
            </th>
            <th
              style={{
                width: "20%",
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Response
            </th>
            <th
              style={{
                width: "20%",
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Notes
            </th>
          </tr>

          {serviceResponse.questions?.map((question, questionIndex) => (
            <tr key={questionIndex}>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                {questionIndex + 1}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {question.question}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {question.answer}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {question.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan={6}
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              IMAGES OF SERVICE ACTIVITY
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {serviceResponse.images.map((image, index) => (
              <td key={index}>
                <img
                  src={image}
                  alt=""
                  className="img-fluid"
                  style={{ height: "150px" }}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Engineers Remarks: {serviceResponse.technicianRemark}
            </th>
          </tr>
        </thead>
      </table>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                backgroundColor: "#f2f2f2",
              }}
            >
              Manager Remarks: {serviceResponse.managerRemark}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <td className="p-2">{serviceResponse.managerRemark}</td>
          </tr> */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "5px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Manager Approval: {serviceResponse.status}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "5px",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Approved By: {serviceResponse.statusUpdatedBy?.name}
              <div className="float-left" style={{ width: "200px" }}>
                Approval Date:{" "}
                {serviceResponse.statusUpdatedAt
                  ? formatDate(serviceResponse.statusUpdatedAt)
                  : ""}
              </div>
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "5px",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Signature Of Technician:
            </td>
          </tr>
        </tbody>
      </table>

      <Box display="flex" justifyContent="flex-end" pb={1} className="buttons">
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleClickOpen("Completed")}
          className="mt-2"
          disabled={
            serviceResponse.status == "Rejected" ||
            serviceResponse.status == "Completed"
          }
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleClickOpen("Rejected")}
          className="mt-2 ms-2"
          disabled={
            serviceResponse.status == "Rejected" ||
            serviceResponse.status == "Completed"
          }
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handlePrint}
          className="mt-2 ms-2"
        >
          <IconPrinter size="20" className="pe-1" />
          Print
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You won't be able to revert this.
          </DialogContentText>
          <Grid spacing={3} container>
            <Grid item xs={12} lg={12}>
              <FormLabel>
                Remark <span className="text-danger">*</span>
              </FormLabel>
              <TextField
                id="remark"
                name="remark"
                size="large"
                placeholder="Enter Remark"
                variant="outlined"
                fullWidth
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleApprove}>
            {status === "Completed" ? "Approve" : "Reject"}
          </Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketResponse;
