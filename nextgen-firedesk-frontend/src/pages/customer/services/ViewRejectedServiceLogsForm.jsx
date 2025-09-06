import { useEffect, useState, useRef } from "react";
import { getRejectedFormById } from "../../../api/organization/internal";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../utils/helpers/formatDate";
import Spinner from "../../admin/spinner/Spinner";
import { Button, Typography, Box } from "@mui/material";
import "./Print.css";
import html2pdf from "html2pdf.js";

const ViewRejectedServiceLogsForm = () => {
  const { serviceId } = useParams();
  const [serviceResponses, setServiceResponses] = useState({});
  const [generalInfo, setGeneralInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const componentRef = useRef();

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

  const fetchData = async () => {
    const response = await getRejectedFormById(serviceId);
    if (response.status === 200) {
      setGeneralInfo(response.data.service.serviceTicketId);
      setServiceResponses(response.data.service.rejectedLogs);
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
      {serviceResponses?.map((serviceResponse, index) => (
        <>
          <Box ref={componentRef} key={serviceResponse?._id || index}>
            <Typography
              variant="h4"
              sx={{
                bgcolor: "primary.main",
                p: 2,
                color: "white",
                textAlign: "center",
              }}
            >
              {generalInfo?.categoryId?.categoryName} ({generalInfo.serviceType}
              , {generalInfo.serviceFrequency})
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
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Service Person Name: {generalInfo?.serviceDoneBy?.name}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Date of Service: {formatDate(generalInfo?.createdAt)}
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
                    Company Name: {generalInfo?.orgUserId.name}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Report Number:{serviceResponse.reportNo}
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
                    Asset ID:{" "}
                    {generalInfo?.assetsId?.map((a) => a?.assetId).join(", ")}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Location:{" "}
                    {generalInfo?.plantId?.plantName +
                      " , " +
                      generalInfo?.plantId?.address +
                      " , " +
                      generalInfo?.plantId?.cityId?.cityName}
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
                    {[
                      ...new Set(
                        generalInfo?.assetsId
                          ?.map((a) => a.productId?.description)
                          .join(", ")
                      ),
                    ]}
                  </th>
                </tr>
                {/* <tr>
                  <th
                    colSpan={6}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Date of Previous Inspection:{" -"}
                  </th>
                </tr> */}
                <tr>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Service Frequency: {generalInfo?.serviceFrequency}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
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
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    Service Type : {generalInfo?.serviceType}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
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
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="inspection"
                      name="inspection"
                      checked={generalInfo?.serviceType == "Inspection"}
                      readOnly
                    />
                    <label htmlFor="inspection">A. INSPECTION</label>
                  </th>
                  <th
                    className="text-center"
                    colSpan={2}
                    style={{
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="maintenance"
                      name="maintenance"
                      checked={generalInfo?.serviceType == "Maintenance"}
                      readOnly
                    />
                    <label htmlFor="maintenance">B. MAINTENANCE</label>
                  </th>
                  <th
                    className="text-center"
                    colSpan={2}
                    style={{
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="testing"
                      name="testing"
                      checked={generalInfo?.serviceType == "Testing"}
                      readOnly
                    />
                    <label htmlFor="testing">C. TESTING</label>
                  </th>
                </tr>

                {serviceResponse?.serviceName === "PUMP ROOM SERVICE" && (
                  <>
                    <tr>
                      <th
                        colSpan={6}
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        <div className="row">
                          <div className="col-4">
                            Pump Type: {serviceResponse?.pumpDetails?.pumpType}
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
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        <div className="row">
                          <div className="col-3">
                            PUMP STATUS:{" "}
                            {serviceResponse?.pumpDetails?.pumpStatus}
                          </div>
                          <div className="col-3">
                            <label>
                              <input
                                type="radio"
                                name="pumpStatus"
                                readOnly
                                checked={
                                  serviceResponse?.pumpDetails?.pumpStatus ===
                                  "AUTO"
                                }
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
                                checked={
                                  serviceResponse?.pumpDetails?.pumpStatus ===
                                  "MANUAL"
                                }
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
                                  serviceResponse?.pumpDetails?.pumpStatus ===
                                  "OFF CONDITION"
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
                          backgroundColor: "#f2f2f2",
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
                                  serviceResponse?.pumpDetails
                                    ?.pumpSequentialOperationTest === "START"
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
                                  serviceResponse?.pumpDetails
                                    ?.pumpSequentialOperationTest === "CUTOFF"
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
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        SUCTION PRESSURE GAUGE READING:{" "}
                        {serviceResponse?.pumpDetails?.suctionPressure}Kgs
                      </th>
                      <th
                        colSpan={3}
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        PRESSURE SWITCH CONDITION:
                        <label>
                          <input
                            type="checkbox"
                            name="pressureSwitchOpen"
                            readOnly
                            checked={
                              serviceResponse?.pumpDetails
                                ?.pressureSwitchCondition === "OPEN"
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
                              serviceResponse?.pumpDetails
                                ?.pressureSwitchCondition === "CLOSE"
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
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        DISCHARGE PRESSURE GAUGE READING:{" "}
                        {
                          serviceResponse?.pumpDetails
                            ?.dischargePressureGaugeReading
                        }
                        Kgs
                      </th>
                    </tr>
                    <tr>
                      <th
                        colSpan="6"
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          backgroundColor: "#f2f2f2",
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
                                checked={
                                  serviceResponse?.pumpDetails?.dieselLevel ===
                                  "FULL"
                                }
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
                                checked={
                                  serviceResponse?.pumpDetails?.dieselLevel ===
                                  "HALF"
                                }
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
                                  serviceResponse?.pumpDetails?.dieselLevel ===
                                  "NEED RE-FUEL"
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
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        BATTERY STATUS: READING-{" "}
                        {serviceResponse?.pumpDetails?.batteryStatusReading}{" "}
                        Volts
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        INSTALLATION DATE:{" "}
                        {formatDate(serviceResponse?.assetId?.installDate)}
                      </th>
                    </tr>
                    <tr>
                      <th
                        colSpan="6"
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          backgroundColor: "#f2f2f2",
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
                                  serviceResponse?.pumpDetails
                                    ?.waterStorageLevel === "FULL"
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
                                  serviceResponse?.pumpDetails
                                    ?.waterStorageLevel === "HALF"
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
                                  serviceResponse?.pumpDetails
                                    ?.waterStorageLevel === "NEED RE-FUEL"
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
                <tr>
                  <th
                    colSpan="6"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    {serviceResponse?.sectionName}
                  </th>
                </tr>
                {serviceResponse?.questions.map((question, index) => {
                  return (
                    <>
                      <tr key={serviceResponse?._id || index}>
                        <td
                          style={{ border: "1px solid black", padding: "5px" }}
                        >
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
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    IMAGES OF SERVICE ACTIVITY
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {serviceResponse?.images.map((image, index) => (
                    <td key={serviceResponse?._id || index}>
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
                    Engineers Remarks:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">{serviceResponse?.TechnicianRemark}</td>
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
                    Manager Remarks:{serviceResponse?.managerRemark}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td className="p-2">{serviceResponse?.managerRemark}</td>
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
                    Approval Status: {serviceResponse?.status}
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
                    Manager: {serviceResponse?.statusUpdatedBy?.name}
                    <div className="float-left" style={{ width: "200px" }}>
                      Date:{" "}
                      {serviceResponse?.statusUpdatedAt
                        ? formatDate(serviceResponse?.statusUpdatedAt)
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
          <Box
            key={serviceResponse?._id || index}
            display="flex"
            justifyContent="flex-end"
            pb={1}
            className="buttons"
          >
            <Button
              id="download-button"
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Download
            </Button>
          </Box>
        </>
      ))}
    </>
  );
};

export default ViewRejectedServiceLogsForm;
