import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById } from "../../../api/admin/internal";
import html2pdf from "html2pdf.js";
import { Box, Button } from "@mui/material";
import Spinner from "../spinner/Spinner";
import PageContainer from "../../../components/container/PageContainer";
import ParentCard from "../../../components/shared/ParentCard";

const ServiceFormDownload = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);

  const componentRef = React.createRef();

  const handleDownload = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.5, // Adjust to your needs
      filename: "ServiceForm.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().from(element).set(opt).save();
  };

  const fetchService = async () => {
    try {
      const response = await getServiceById(serviceId);

      setService(response.data.service);
      setImages(response.data.organization);
    } catch (error) {
      console.error("Error fetching service details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <PageContainer
        title="Service Form"
        description="service form download view"
      >
        <ParentCard>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            my={1}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </Box>
          <Box display="flex" justifyContent="center">
            <div ref={componentRef} style={{ border: "1px solid black" }}>
              {images?.headerImage && (
                <div className="text-center">
                  <img
                    src={images.headerImage}
                    alt="Header"
                    style={{
                      width: "18%",
                      height: "100px",
                      objectFit: "contain",
                      marginBottom: "20px",
                    }}
                  />
                </div>
              )}
              <h1 className="text-white bg-warning p-3 rounded text-center">
                {service?.serviceName}
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
                      Service Person Name:
                    </th>
                    <th
                      colSpan={3}
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      Date of Service:
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
                      Company Name:
                    </th>
                    <th
                      colSpan={3}
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      Report Number:
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
                      Asset ID:
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
                      Asset Description:
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
                      Date of Previous Inspection:
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
                      Service Frequency:{" "}
                    </th>
                    <th
                      colSpan={3}
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      Date of Last Test:
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
                      Service Type : AMC
                    </th>
                    <th
                      colSpan={3}
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      Next Test Due on :
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
                        id="maintenance/service"
                        name="maintenance/service"
                        readOnly
                      />
                      <label htmlFor="maintenance/service">
                        B. MAINTENANCE / SERVICE
                      </label>
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
                        readOnly
                      />
                      <label htmlFor="testing">C. TESTING</label>
                    </th>
                  </tr>
                  {service?.serviceName === "PUMP ROOM SERVICE" && (
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
                              Pump Type:
                              {/* {serviceResponse.pumpDetails.pumpType} */}
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
                            <div className="col-3">PUMP STATUS:</div>
                            <div className="col-3">
                              <label>
                                <input
                                  type="radio"
                                  name="pumpStatus"
                                  readOnly
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
                          SUCTION PRESSURE GAUGE READING: Kgs
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
                            />{" "}
                            OPEN
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="pressureSwitchClose"
                              readOnly
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
                          DISCHARGE PRESSURE GAUGE READING: Kgs
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
                          BATTERY STATUS: READING- Volts
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            backgroundColor: "#f2f2f2",
                          }}
                        >
                          INSTALLATION DATE:{" "}
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
                  {service?.sectionName.map((section, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <th
                            colSpan="6"
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              backgroundColor: "#f2f2f2",
                            }}
                          >
                            {section.name}
                          </th>
                        </tr>
                        {section.questions.map((questions, questionIndex) => (
                          <tr key={questionIndex}>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                              }}
                            >
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
                              {questions.question}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              {/* {question.answer} */}
                            </td>

                            <td
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              {/* {question.note} */}
                            </td>
                          </tr>
                        ))}
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
                    <td className="p-4"></td>
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
                    <td className="p-4"></td>
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
                      Manager Remarks:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4"></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Manager Approval:
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
                      Manager Name:
                      <div className="float-left" style={{ width: "200px" }}>
                        Approval Date:{" "}
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

              {images?.footerImage && (
                <div className="text-end">
                  <img
                    src={images.footerImage}
                    alt="Footer"
                    style={{
                      width: "18%",
                      height: "100px",
                      objectFit: "contain",
                      marginTop: "20px",
                    }}
                  />
                </div>
              )}
            </div>
          </Box>
        </ParentCard>
      </PageContainer>
    </>
  );
};

export default ServiceFormDownload;
