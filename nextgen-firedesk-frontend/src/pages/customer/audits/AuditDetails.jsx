import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Box, Button, Grid, TextField } from "@mui/material";
import PageContainer from "../../../components/container/PageContainer";
import ParentCard from "../../../components/shared/ParentCard";
import Spinner from "../../admin/spinner/Spinner";
import { getAuditDetailsById } from "../../../api/organization/internal";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import html2pdf from "html2pdf.js";
import CustomCheckbox from "../../../components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { formatDate } from "../../../utils/helpers/formatDate";
import { padding } from "@mui/system";

const pdfStyles = {
  pageContainer: {
    margin: "25px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    paddingBottom: "10px",
    marginBottom: "10px",
    borderBottom: "1px solid black",
  },
  subHeading: {
    borderBottom: "1px solid #000",
    paddingBottom: "3px",
    marginBottom: "5px",
    textAlign: "left",
  },
};

const AuditDetails = () => {
  const { auditId } = useParams();
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState([]);

  const componentRef = useRef();

  useEffect(() => {
    const fetchAuditDetails = async () => {
      const response = await getAuditDetailsById(auditId);
      if (response.status === 200) {
        setAudit(response.data || []);
        setLoading(false);
      }
    };
    fetchAuditDetails();
  }, [auditId]);

  const BCrumb = [
    {
      to: "/customer",
      title: "Home",
    },
    {
      to: "/customer/audits",
      title: "Audits",
    },
    {
      title: "Audit Detail",
    },
  ];

  const handleDownload = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.2,
      filename: "my_self_audit.pdf",
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

  return (
    <PageContainer
      title="Audit Details"
      description="This is the Audit Details page"
    >
      <Breadcrumb title="Audit Detail" items={BCrumb} />
      <ParentCard>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Paper
              variant="outlined"
              style={{ padding: 20, overflow: "hidden" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" gutterBottom>
                  Audit Details
                </Typography>
                <Button
                  id="download-button"
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </Box>
              <div ref={componentRef} style={pdfStyles.pageContainer}>
                <Grid item xs={12} style={pdfStyles.heading}>
                  <Typography variant="h2">
                    Fire Safety Inspection Checklist
                  </Typography>
                </Grid>

                <Grid container spacing={2}>
                  {/* Workplace Name/Location */}
                  <Grid item sm={3}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="workplace">
                      Workplace Name/Location
                    </CustomFormLabel>
                  </Grid>
                  <Grid item sm={9}>
                    <CustomTextField
                      id="workplace"
                      value={audit.workPlace}
                      variant="outlined"
                      placeholder=""
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  {/* Date of Inspection */}
                  <Grid item sm={3}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="dateOfInspection">
                      Date of Inspection
                    </CustomFormLabel>
                  </Grid>
                  <Grid item sm={3}>
                    <CustomTextField
                      id="dateOfInspection"
                      value={formatDate(audit.createdAt)}
                      variant="outlined"
                      placeholder=""
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  {/* Inspector Name */}
                  <Grid item sm={3}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="InspectorName">
                      Inspector Name
                    </CustomFormLabel>
                  </Grid>
                  <Grid item sm={3}>
                    <CustomTextField
                      id="InspectorName"
                      value={audit.inspectorName}
                      variant="outlined"
                      placeholder=""
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item sm={12} border="3px dotted #000" p={2} mb={2}>
                    <Typography variant="h6">INSTRUCTIONS:</Typography>

                    <Grid item sm={12}>
                      <Typography>
                        This checklist is designed to assess the fire safety
                        measures in the workplace. Carefully review each item
                        and mark the corresponding checkbox to indicate
                        compliance or note any observations and areas for
                        improvement. Use the "Notes/Observations" section to
                        provide additional details, corrective actions, and any
                        required follow-up.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {audit.length === 0 ? (
                  <Typography variant="body1">
                    No audit details available.
                  </Typography>
                ) : (
                  (() => {
                    return audit.categories.map((item, index) => {
                      return (
                        <Box key={index}>
                          <Typography variant="h5" style={pdfStyles.subHeading}>
                            {item.categoryName}
                          </Typography>
                          {item.questions.map((question) => (
                            <Grid container key={index}>
                              {question.ans === 1 ||
                              question.ans === 0 ||
                              question.ans === 2 ? (
                                <>
                                  <Grid question sm={8}>
                                    <Typography mt={2}>
                                      <li>{question.questionText}</li>{" "}
                                    </Typography>
                                  </Grid>
                                  <Grid question sm={4}>
                                    <Typography mt={2}>
                                      <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        gap={2}
                                      >
                                        <Box display="flex" alignItems="center">
                                          <CustomCheckbox
                                            onChange={() => {}}
                                            color="primary"
                                            checked={question.ans === 1}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{ marginLeft: "4px" }}
                                          >
                                            Yes
                                          </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                          <CustomCheckbox
                                            onChange={() => {}}
                                            color="primary"
                                            checked={question.ans === 0}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{ marginLeft: "4px" }}
                                          >
                                            No
                                          </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                          <CustomCheckbox
                                            onChange={() => {}}
                                            color="primary"
                                            checked={question.ans === 2}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{ marginLeft: "4px" }}
                                          >
                                            N/A
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Typography>
                                  </Grid>
                                </>
                              ) : (
                                <>
                                  <Grid question sm={12}>
                                    <Typography mt={2}>
                                      <li>{question.questionText}</li>
                                    </Typography>
                                  </Grid>
                                  <Grid question sm={12}>
                                    <Box
                                      sx={{
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        minHeight: "60px",
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {question.ans}{" "}
                                    </Box>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          ))}
                        </Box>
                      );
                    });
                  })()
                )}
                <Grid
                  container
                  mt={2}
                  pb={1}
                  borderBottom="1px solid #000"
                  borderTop="1px solid #000"
                >
                  <Typography variant="h5" pt={2}>
                    ADDITIONAL NOTES/OBSERVATIONS
                  </Typography>
                  <Grid item sm={12}>
                    <Typography variant="h6" my={1}>
                      [Insert any additional notes or Aviation Safety checklist
                      observations made during the inspection]
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        minHeight: "60px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                    >
                      {audit.additionalNotes}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container mt={2} pb={1} borderBottom="1px solid black">
                  <Typography variant="h5">STATEMENT OF INSPECTION</Typography>
                  <Grid item sm={12} my={1}>
                    I hereby certify that I have conducted the above Aviation
                    Safety Inspection checklist and that the aviation operation
                    has been assessed for safety and compliance. Any identified
                    issues have been documented, and necessary corrective
                    actions have been recommended.
                  </Grid>
                  <Grid item sm={6}>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="inspectorName">
                          Inspector's Name
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="inspectorName"
                          value={audit.inspectorName}
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="signature">
                          Date
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="signature"
                          value={formatDate(audit.createdAt)}
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item sm={6}>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="date">
                          Signature
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="date"
                          value=""
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item sm={12}>
                    <Typography variant="h5">APPROVED BY</Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="inspectorName">
                          Name
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="approverName"
                          value=""
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="date">
                          Date
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="date"
                          value=""
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item sm={6}>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="signature">
                          Signature
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="signature"
                          value=""
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default AuditDetails;
