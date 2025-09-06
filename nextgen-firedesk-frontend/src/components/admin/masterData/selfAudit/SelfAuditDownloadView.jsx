import {
  Grid,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React from "react";
import CustomFormLabel from "../../../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../forms/theme-elements/CustomTextField";
import CustomCheckbox from "../../../forms/theme-elements/CustomCheckbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// const pdfStyles = {
//   pageContainer: {
//     margin: "0",
//     fontFamily: "Arial, sans-serif",
//     padding: "20px",
//   },
//   heading: {
//     textAlign: "center",
//     paddingBottom: "10px",
//     marginBottom: "10px",
//     borderBottom: "1px solid black",
//   },
//   subHeading: {
//     borderBottom: "1px solid #000",
//     paddingBottom: "10px",
//     marginBottom: "20px",
//     textAlign: "left", // Adjusted alignment to prevent start issues
//   },
// };

const DownloadableComponent = React.forwardRef(({ data }, ref) => {
  return (
    <div ref={ref}>
      <Grid item xs={12} pb={2} className="border-bottom">
        <Typography variant="h2" align="center">
          Fire Safety Inspection Checklist
        </Typography>
      </Grid>

      <Grid container spacing={2} mt={1} pb={2}>
        {/* Workplace Name/Location */}
        <Grid item sm={3}>
          <CustomFormLabel sx={{ mt: 0 }} htmlFor="workplace">
            Workplace Name/Location
          </CustomFormLabel>
        </Grid>
        <Grid item sm={9}>
          <CustomTextField
            id="workplace"
            value=""
            variant="outlined"
            placeholder=""
            fullWidth
            InputProps={{ readOnly: true }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#e0e0e081', // Darker background color
              },
            }}
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
            value=""
            variant="outlined"
            placeholder=""
            fullWidth
            InputProps={{ readOnly: true }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#e0e0e081', // Darker background color
              },
            }}
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
            value=""
            variant="outlined"
            placeholder=""
            fullWidth
            InputProps={{ readOnly: true }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#e0e0e081', // Darker background color
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid container mt={1} mb={2}>
        <Grid item sm={12} border="3px dotted #000" p={1}>
          <Typography variant="p" fontWeight={600}>
            INSTRUCTIONS:
          </Typography>

          <Grid item sm={12} fontSize={12}>
            This checklist is designed to assess the fire safety measures in the
            workplace. Carefully review each item and mark the corresponding
            checkbox to indicate compliance or note any observations and areas
            for improvement. Use the "Notes/Observations" section to provide
            additional details, corrective actions, and any required follow-up.
          </Grid>
        </Grid>
      </Grid>

      {/* Category Loop */}
      {data.categories.map((category, index) => (
        <Box key={index} mb={2} className="border-bottom">
          <Typography variant="p" fontWeight={600}>
            {category.categoryName}
          </Typography>
          <ul className="p-0">
            {category.questions.map((question, qIndex) => (
              <Grid container key={qIndex} display="flex" alignItems="center">
                <Grid item sm={9}>
                  <CustomFormLabel sx={{ m: 0 }} htmlFor="question">
                    <li className="ms-3">
                      <Typography fontWeight={500} fontSize={12}>
                        {question.questionText}
                      </Typography>
                    </li>
                  </CustomFormLabel>
                </Grid>
                {question.questionType === "Yes/No" ? (
                  <Grid item sm={3}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap={1}
                    >
                      <Box display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              icon={
                                <CheckBoxOutlineBlankIcon
                                  fontSize="small"
                                  sx={{ height: "12px" }}
                                />
                              }
                              checkedIcon={
                                <CheckBoxIcon
                                  fontSize="small"
                                  sx={{ height: "12px" }}
                                />
                              }
                              name="checkedsmall"
                            />
                          }
                          label="Yes"
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "12px",
                            },
                          }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              icon={
                                <CheckBoxOutlineBlankIcon
                                  fontSize="small"
                                  sx={{ height: "12px" }}
                                />
                              }
                              checkedIcon={
                                <CheckBoxIcon
                                  fontSize="small"
                                  sx={{ height: "12px" }}
                                />
                              }
                              name="checkedsmall"
                            />
                          }
                          label="No"
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "12px",
                            },
                          }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              icon={
                                <CheckBoxOutlineBlankIcon
                                  fontSize="small"
                                  sx={{ height: "12px" }}
                                />
                              }
                              checkedIcon={
                                <CheckBoxIcon
                                  fontSize="small"
                                  sx={{ height: "12px" }}
                                />
                              }
                              name="checkedsmall"
                            />
                          }
                          label="N/A"
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "12px",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={12} mt={1}>
                    <CustomTextField
                      id="question"
                      value=""
                      variant="outlined"
                      placeholder=""
                      fullWidth
                      InputProps={{ readOnly: true }}
                      multiline
                      rows={2}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#e0e0e081', // Darker background color
                        },
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
          </ul>
        </Box>
      ))}
      <Box mb={2} className="border-bottom">
        <Typography variant="p" fontWeight={600}>
          ADDITIONAL NOTES/OBSERVATIONS
        </Typography>
        <Grid item sm={12}>
          <CustomFormLabel sx={{ mt: 0 }} htmlFor="observations">
            <Typography variant="p" fontWeight={500}>
              [Insert any additional notes or Aviation Safety checklist
              observations made during the inspection]
            </Typography>
          </CustomFormLabel>
        </Grid>
        <Grid item sm={12}>
          <CustomTextField
            id="observations"
            value=""
            variant="outlined"
            placeholder=""
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#e0e0e081', // Darker background color
              },
            }}
          />
        </Grid>
      </Box>
      <Box mb={2} className="border-bottom">
        <Typography variant="p" fontWeight={600}>
          STATEMENT OF INSPECTION
        </Typography>
        <Grid item sm={12} pb={3}>
          I hereby certify that I have conducted the above Aviation Safety
          Inspection checklist and that the aviation operation has been assessed
          for safety and compliance. Any identified issues have been documented,
          and necessary corrective actions have been recommended.
        </Grid>
        <Grid container spacing={2}>
          {/* First Column - 6 columns wide */}
          <Grid item sm={6}>
            <Grid container spacing={2} pb={3}>
              {/* First Row in the first column */}
              <Grid item sm={4}>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor="inspectorName">
                  Inspector's Name
                </CustomFormLabel>
              </Grid>
              <Grid item sm={8}>
                <CustomTextField
                  id="inspectorName"
                  value=""
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#e0e0e081', // Darker background color
                    },
                  }}
                />
              </Grid>

              {/* Second Row in the first column */}
              <Grid item sm={4}>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor="signature">
                  Date
                </CustomFormLabel>
              </Grid>
              <Grid item sm={8}>
                <CustomTextField
                  id="signature"
                  value=""
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#e0e0e081', // Darker background color
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Second Column - 6 columns wide */}
          <Grid item sm={6}>
            <Grid container spacing={2} pb={3}>
              <Grid item sm={4}>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor="date">
                  Signature
                </CustomFormLabel>
              </Grid>
              <Grid item sm={8}>
                <CustomTextField
                  id="date"
                  value=""
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#e0e0e081', // Darker background color
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box mb={2} className="border-bottom" mt={1}>
        <Typography variant="p" fontWeight={600}>
          APPROVED BY
        </Typography>

        <Grid container spacing={2}>
          {/* First Column - 6 columns wide */}
          <Grid item sm={6}>
            <Grid container spacing={2} pb={3}>
              {/* First Row in the first column */}
              <Grid item sm={4}>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor="inspectorName">
                  Name
                </CustomFormLabel>
              </Grid>
              <Grid item sm={8}>
                <CustomTextField
                  id="inspectorName"
                  value=""
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#e0e0e081', // Darker background color
                    },
                  }}
                />
              </Grid>

              {/* Second Row in the first column */}
              <Grid item sm={4}>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor="signature">
                  Date
                </CustomFormLabel>
              </Grid>
              <Grid item sm={8}>
                <CustomTextField
                  id="signature"
                  value=""
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#e0e0e081', // Darker background color
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Second Column - 6 columns wide */}
          <Grid item sm={6}>
            <Grid container spacing={2} pb={3}>
              <Grid item sm={4}>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor="date">
                  Signature
                </CustomFormLabel>
              </Grid>
              <Grid item sm={8}>
                <CustomTextField
                  id="date"
                  value=""
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#e0e0e081', // Darker background color
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
});

export default DownloadableComponent;
