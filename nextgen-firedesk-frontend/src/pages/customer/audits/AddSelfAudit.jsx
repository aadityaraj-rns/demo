import { Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ParentCard from "../../../components/shared/ParentCard";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import {
  getAuditForm,
  addSelfAuditForm,
} from "../../../api/organization/internal";
import Spinner from "../../admin/spinner/Spinner";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { formatDate } from "../../../utils/helpers/formatDate";

const AddSelfAudit = ({ onSuccess }) => {
  const [selfAudit, setSelfAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    workPlace: "",
    inspectorName: "",
    additionalNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  // const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    const fetchSelfAuditQs = async () => {
      const response = await getAuditForm();
      if (response.status === 200) {
        const categories = response.data.selfAuditQuestions.categories || [];
        setSelfAudit(categories);

        const initialFormValues = {
          workPlace: "",
          inspectorName: "",
          additionalNotes: "",
        };
        categories.forEach((category) => {
          category.questions.forEach((question) => {
            initialFormValues[`${category._id}-${question._id}`] = "";
          });
        });
        setInitialValues(initialFormValues);
        setLoading(false);
      }
    };
    fetchSelfAuditQs();
  }, []);

  const validationSchema = Yup.object().shape(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = Yup.string().required("This field is required");
      return acc;
    }, {})
  );

  const handleSubmit = async (values) => {
    setSubmitting(true);

    const formattedData = {
      workPlace: values.workPlace,
      inspectorName: values.inspectorName,
      categories: [],
    };

    if (values.additionalNotes.trim() !== "") {
      formattedData.additionalNotes = values.additionalNotes;
    }

    selfAudit.forEach((category) => {
      const categoryData = {
        categoryName: category.categoryName,
        questions: [],
      };

      category.questions.forEach((question) => {
        const key = `${category._id}-${question._id}`;
        const answer = values[key];

        categoryData.questions.push({
          questionText: question.questionText,
          ans:
            question.questionType === "Input"
              ? answer
              : answer === "Yes"
              ? 1
              : 0,
        });
      });

      formattedData.categories.push(categoryData);
    });

    try {
      const response = await addSelfAuditForm(formattedData);
      if (response.status === 200) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ParentCard title="Self Audit Form">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, handleChange }) => (
              <Form>
                <Grid item xs={12}>
                  <Typography
                    variant="h2"
                    style={{
                      textAlign: "center",
                      paddingBottom: "10px",
                      marginBottom: "10px",
                      borderBottom: "1px solid black",
                    }}
                  >
                    Fire Safety Inspection Checklist
                  </Typography>
                </Grid>
                <Grid container spacing={2} mt={1} pb={2}>
                  {/* Workplace Name/Location */}
                  <Grid item sm={4}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="workPlace">
                      Workplace Name/Location
                    </CustomFormLabel>
                  </Grid>
                  <Grid item sm={8}>
                    <CustomTextField
                      id="workPlace"
                      value={values.workPlace}
                      placeholder="Enter Workplace"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="workPlace"
                      component="div"
                      style={{ color: "red" }}
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
                      value={formatDate(new Date())}
                      variant="outlined"
                      placeholder=""
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  {/* Inspector Name */}
                  <Grid item sm={3}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="inspectorName">
                      Inspector Name
                    </CustomFormLabel>
                  </Grid>
                  <Grid item sm={3}>
                    <CustomTextField
                      id="inspectorName"
                      value={values.inspectorName}
                      placeholder="Enter inspectorName"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="inspectorName"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item sm={12} border="3px dotted #000" p={2} mb={2}>
                    <Typography variant="h6">INSTRUCTIONS:</Typography>

                    <Grid item sm={12}>
                      This checklist is designed to assess the fire safety
                      measures in the workplace. Carefully review each item and
                      mark the corresponding checkbox to indicate compliance or
                      note any observations and areas for improvement. Use the
                      "Notes/Observations" section to provide additional
                      details, corrective actions, and any required follow-up.
                    </Grid>
                  </Grid>
                </Grid>
                {selfAudit.map((category, catIndex) => (
                  <Grid container spacing={3} key={catIndex}>
                    <Grid item xs={12}>
                      <Typography variant="h5" className="text-primary">
                        {category.categoryName}
                      </Typography>
                    </Grid>
                    {category.questions.map((question, qIndex) => (
                      <Grid
                        container
                        spacing={2}
                        key={qIndex}
                        sx={{ marginBottom: "16px", paddingLeft: "30px" }}
                      >
                        <Grid item xs={12} display="flex" alignItems="center">
                          <CustomFormLabel htmlFor={`question-${question._id}`}>
                            <li>
                              {question.questionText}
                              <span className="text-danger">*</span>
                            </li>
                          </CustomFormLabel>
                        </Grid>
                        {question.questionType === "Input" ? (
                          <Grid item xs={12}>
                            <Field
                              as={CustomTextField}
                              id={`question-${question._id}`}
                              name={`${category._id}-${question._id}`}
                              placeholder={`Enter response for: ${question.questionText}`}
                              multiline
                              fullWidth
                            />
                            <ErrorMessage
                              name={`${category._id}-${question._id}`}
                              component="div"
                              style={{ color: "red" }}
                            />
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
                            <Field
                              as={Select}
                              id={`question-${question._id}`}
                              name={`${category._id}-${question._id}`}
                              fullWidth
                              variant="outlined"
                              value={
                                values[`${category._id}-${question._id}`] || ""
                              }
                              onChange={handleChange}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                Select One
                              </MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Field>
                            <ErrorMessage
                              name={`${category._id}-${question._id}`}
                              component="div"
                              style={{ color: "red" }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                ))}
                <Grid
                  container
                  spacing={2}
                  mt={1}
                  pb={2}
                  borderBottom="1px solid #000"
                >
                  <Typography variant="h4">
                    ADDITIONAL NOTES/OBSERVATIONS
                  </Typography>
                  <Grid item sm={12}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="additionalNotes">
                      [Insert any additional notes or checklist observations
                      made during the inspection]
                    </CustomFormLabel>
                  </Grid>
                  <Grid item sm={12}>
                    <CustomTextField
                      id="additionalNotes"
                      value={values.additionalNotes}
                      variant="outlined"
                      placeholder=""
                      fullWidth
                      multiline
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  mt={1}
                  pb={2}
                  borderBottom="1px solid black"
                >
                  <Typography variant="h4">STATEMENT OF INSPECTION</Typography>
                  <Grid item sm={12} pb={3}>
                    I hereby certify that I have conducted the above Safety
                    Inspection checklist and that the operation has been
                    assessed for safety and compliance.
                  </Grid>
                  <Grid item sm={6}>
                    <Grid container spacing={2} pb={3}>
                      {/* First Row in the first column */}
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="inspectorName">
                          Inspector's Name
                        </CustomFormLabel>
                      </Grid>
                      <Grid item sm={6}>
                        <CustomTextField
                          id="inspectorName"
                          value={values.inspectorName}
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>

                      {/* Second Row in the first column */}
                      <Grid item sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="signature">
                          Date
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

                  {/* Second Column - 6 columns wide */}
                  <Grid item sm={6}>
                    <Grid container spacing={2} pb={3}>
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
                <Grid container spacing={2} mt={1} pb={2}>
                  <Typography variant="h4" gutterBottom>
                    APPROVED BY
                  </Typography>
                  <Grid item sm={12}></Grid>
                  {/* First Column - Name and Date */}
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

                  {/* Second Column - Signature */}
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
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </ParentCard>
      </Grid>
    </Grid>
  );
};

export default AddSelfAudit;
