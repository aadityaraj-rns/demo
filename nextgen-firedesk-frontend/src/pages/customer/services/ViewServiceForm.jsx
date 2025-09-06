import { useEffect, useState, useRef } from "react";
import {
  getServicesResponseById,
  updateServicesResponseStatus,
} from "../../../api/organization/internal";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../../utils/helpers/formatDate";
import Spinner from "../../admin/spinner/Spinner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Toaster from "../../../components/toaster/Toaster";
import "./Print.css";
import html2pdf from "html2pdf.js";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import { Close } from "@mui/icons-material";

const ViewServiceForm = () => {
  const { serviceTicketId } = useParams();
  const [open, setOpen] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterProps, setToasterProps] = useState({});
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const componentRef = useRef();
  const navigator = useNavigate();

  const handleDownload = () => {
    const element = componentRef.current;

    const opt = {
      margin: 0.2,
      filename: "completed_service_form.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css"],
      },
    };

    html2pdf().from(element).set(opt).save();
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
    const response = await updateServicesResponseStatus(
      serviceTicketId,
      status,
      remark
    );
    if (response.status == 200) {
      fetchData();
      setToasterProps({
        title: "Service Form",
        message: "Status updated successfully",
        color: "success",
      });
      setShowToaster(true);
      setRemark("");
      setStatus("");
      navigator("/customer/service-calendar");
    }
  };

  const fetchData = async () => {
    const response = await getServicesResponseById(serviceTicketId);
    if (response.status === 200) {
      setData(response.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <Box ref={componentRef}>
        {showToaster && (
          <Toaster
            title={toasterProps.title}
            message={toasterProps.message}
            color={toasterProps.color}
          />
        )}
        <Typography
          variant="h4"
          sx={{
            bgcolor: "primary.main",
            p: 2,
            color: "white",
            textAlign: "center",
          }}
        >
          {data?.categoryId?.categoryName} ({data.serviceType},{" "}
          {data.serviceFrequency})
        </Typography>

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
                }}
              >
                Service Person Name: {data?.serviceDoneBy?.name}
              </th>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Date of Service: {formatDate(data?.date)}
              </th>
            </tr>
            <tr>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Company Name: {data?.orgUserId?.name}
              </th>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Report Number: {data?.submittedFormId?.reportNo}
              </th>
            </tr>
            <tr>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Asset ID: {data?.assetsId?.map((a) => a.assetId).join(", ")}
              </th>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Location:{" "}
                {data?.plantId?.plantName +
                  " , " +
                  data?.plantId?.address +
                  " , " +
                  data?.plantId?.cityId?.cityName}
              </th>
            </tr>
            <tr>
              <th
                colSpan={6}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Asset Description:{" "}
                {[
                  ...new Set(
                    data?.assetsId
                      ?.map((a) => a.productId?.description)
                      .join(", ")
                  ),
                ]}
              </th>
            </tr>
            <tr>
              {/* <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Date of Previous Inspection:{" -"}
              </th> */}
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Geo Check: {data?.submittedFormId?.geoCheck}
              </th>
            </tr>
            <tr>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Service Frequency: {data?.serviceFrequency}
              </th>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Date of Last Test:{" -"}
              </th>
            </tr>
            <tr>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Service Type : {data?.serviceType}
              </th>
              <th
                colSpan={3}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Next Test Due on :{" -"}
              </th>
            </tr>
            <tr>
              <th
                className="text-center"
                colSpan={2}
                style={{
                  padding: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="inspection"
                  name="inspection"
                  checked={data?.serviceType == "Inspection"}
                  readOnly
                />
                <label htmlFor="inspection">A. INSPECTION</label>
              </th>
              <th
                className="text-center"
                colSpan={2}
                style={{
                  padding: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="maintenance"
                  name="maintenance"
                  checked={data?.serviceType == "Maintenance"}
                  readOnly
                />
                <label htmlFor="maintenance">B. MAINTENANCE</label>
              </th>
              <th
                className="text-center"
                colSpan={2}
                style={{
                  padding: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="testing"
                  name="testing"
                  checked={data?.serviceType == "Testing"}
                  readOnly
                />
                <label htmlFor="testing">C. TESTING</label>
              </th>
            </tr>

            {data?.serviceName === "PUMP ROOM SERVICE" && (
              <>
                <tr>
                  <th
                    colSpan={6}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    <div className="row">
                      <div className="col-4">
                        Pump Type: {data?.pumpDetails.pumpType}
                      </div>
                    </div>
                  </th>
                </tr>
                <tr className="header">
                  <th
                    colSpan={6}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    <div className="row">
                      <div className="col-3">
                        PUMP STATUS: {data?.pumpDetails.pumpStatus}
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="radio"
                            name="pumpStatus"
                            readOnly
                            checked={data?.pumpDetails.pumpStatus === "AUTO"}
                          />{" "}
                          AUTO
                        </label>
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="radio"
                            name="pumpStatus"
                            readOnly
                            checked={data?.pumpDetails.pumpStatus === "MANUAL"}
                          />{" "}
                          MANUAL
                        </label>
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="radio"
                            name="pumpStatus"
                            readOnly
                            checked={
                              data?.pumpDetails.pumpStatus === "OFF CONDITION"
                            }
                          />{" "}
                          OFF CONDITION
                        </label>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={6}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    <div className="row">
                      <div className="col-4">
                        PUMP SEQUENTIAL OPERATION TEST:
                      </div>
                      <div className="col-4">
                        <label>
                          <input
                            type="checkbox"
                            name="operationTestStart"
                            readOnly
                            checked={
                              data?.pumpDetails.pumpSequentialOperationTest ===
                              "START"
                            }
                          />{" "}
                          START
                        </label>
                      </div>
                      <div className="col-4">
                        <label>
                          <input
                            type="checkbox"
                            name="operationTestCutOff"
                            readOnly
                            checked={
                              data?.pumpDetails.pumpSequentialOperationTest ===
                              "CUTOFF"
                            }
                          />{" "}
                          CUTOFF
                        </label>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    SUCTION PRESSURE GAUGE READING:{" "}
                    {data?.pumpDetails.suctionPressure}Kgs
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    PRESSURE SWITCH CONDITION:
                    <label>
                      <input
                        type="checkbox"
                        name="pressureSwitchOpen"
                        readOnly
                        checked={
                          data?.pumpDetails.pressureSwitchCondition === "OPEN"
                        }
                      />{" "}
                      OPEN
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="pressureSwitchClose"
                        readOnly
                        checked={
                          data?.pumpDetails.pressureSwitchCondition === "CLOSE"
                        }
                      />{" "}
                      CLOSE
                    </label>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="6"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    DISCHARGE PRESSURE GAUGE READING:{" "}
                    {data?.pumpDetails.dischargePressureGaugeReading}
                    Kgs
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="6"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    <div className="row">
                      <div className="col-3">DIESEL LEVEL:</div>
                      <div className="col-3">
                        <label>
                          <input
                            type="checkbox"
                            name="dieselLevelFull"
                            readOnly
                            checked={data?.pumpDetails.dieselLevel === "FULL"}
                          />{" "}
                          FULL
                        </label>
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="checkbox"
                            name="dieselLevelHalf"
                            readOnly
                            checked={data?.pumpDetails.dieselLevel === "HALF"}
                          />{" "}
                          HALF
                        </label>
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="checkbox"
                            name="dieselLevelRefuel"
                            readOnly
                            checked={
                              data?.pumpDetails.dieselLevel === "NEED RE-FUEL"
                            }
                          />{" "}
                          NEED RE-FUEL
                        </label>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="5"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    BATTERY STATUS: READING-{" "}
                    {data?.pumpDetails.batteryStatusReading} Volts
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    INSTALLATION DATE: {formatDate(data?.assetId?.installDate)}
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="6"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    <div className="row">
                      <div className="col-3">WATER STORAGE LEVEL:</div>
                      <div className="col-3">
                        <label>
                          <input
                            type="checkbox"
                            name="waterLevelFull"
                            readOnly
                            checked={
                              data?.pumpDetails.waterStorageLevel === "FULL"
                            }
                          />{" "}
                          FULL
                        </label>
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="checkbox"
                            name="waterLevelHalf"
                            readOnly
                            checked={
                              data?.pumpDetails.waterStorageLevel === "HALF"
                            }
                          />{" "}
                          HALF
                        </label>
                      </div>
                      <div className="col-3">
                        <label>
                          <input
                            type="checkbox"
                            name="waterLevelRefuel"
                            readOnly
                            checked={
                              data?.pumpDetails.waterStorageLevel ===
                              "NEED RE-FUEL"
                            }
                          />{" "}
                          NEED RE-FUEL
                        </label>
                      </div>
                    </div>
                  </th>
                </tr>
              </>
            )}
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
                }}
              >
                SL No
              </th>
              <th
                style={{
                  width: "55%",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Response
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Notes
              </th>
            </tr>
            <tr>
              <th
                colSpan="6"
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                {data?.submittedFormId?.sectionName}
              </th>
            </tr>
            {data?.submittedFormId?.questions?.map((question, index) => {
              return (
                <>
                  <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "5px" }}>
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {question?.question}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {question?.answer}
                    </td>

                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {question?.note}
                    </td>
                  </tr>
                </>
              );
            })}
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
                }}
              >
                IMAGES OF SERVICE ACTIVITY
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {data?.submittedFormId?.images?.map((image, index) => (
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
                }}
              >
                Engineers Remarks: {data?.submittedFormId?.technicianRemark}
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
                }}
              >
                Manager Remarks: {data?.submittedFormId?.managerRemark}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  padding: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Manager Approval: {data?.completedStatus}
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
                Manager Name: {data?.statusUpdatedBy?.name}
                <div className="float-left" style={{ width: "200px" }}>
                  Approval Date:{" "}
                  {data?.completedStatus != "Waiting for approval"
                    ? formatDate(data?.updatedAt)
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
      </Box>
      <Box display="flex" gap={1} mt={1}>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleClickOpen("Completed")}
          disabled={data?.completedStatus !== "Waiting for approval"}
        >
          Approve
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleClickOpen("Rejected")}
          disabled={data?.completedStatus !== "Waiting for approval"}
        >
          Reject
        </Button>
        <Button
          size="small"
          id="download-button"
          variant="contained"
          color="primary"
          onClick={handleDownload}
        >
          Download
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={dialogTitleStyles}
          variant="h5"
        >
          {"Are you sure?"}
          <IconButton aria-label="close" onClick={handleClose}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid spacing={3} container mt>
            <Grid item xs={12} lg={12}>
              <TextField
                label={"Remark"}
                InputLabelProps={{ shrink: true }}
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
          <DialogContentText sx={{ color: "lightpink" }}>
            {"You won't be able to revert this."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleApprove}>
            {status === "Completed" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewServiceForm;
