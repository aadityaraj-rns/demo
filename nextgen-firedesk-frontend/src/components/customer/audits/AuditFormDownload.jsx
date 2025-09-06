import React from "react";
import PageContainer from "../../container/PageContainer";
import { Grid, Typography } from "@mui/material";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../forms/theme-elements/CustomFormLabel";

const AuditFormDownload = () => {
  return (
    <PageContainer title="Pricing" description="this is Pricing page">
      <Grid container spacing={3} justifyContent="center" mt={3}>
        <Grid
          item
          xs={12}
          textAlign="center"
          pb={3}
          mb={3}
          borderBottom="1px solid black"
        >
          <Typography variant="h2">Fire Safety Inspection Checklist</Typography>
        </Grid>
        <Grid container spacing={2} mt={1} pb={2}>
          <Grid item sm={2}>
            <CustomFormLabel sx={{ mt: 0 }} htmlFor="workplace">
              Workplace Name/Location
            </CustomFormLabel>
          </Grid>
          <Grid item sm={10}>
            <CustomTextField
              id="workplace"
              value={""}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              fullWidth
              readOnly
            />
          </Grid>
          <Grid item sm={2}>
            <CustomFormLabel sx={{ mt: 0 }} htmlFor="dateOfInspection">
              Date of Inspection
            </CustomFormLabel>
          </Grid>
          <Grid item sm={4}>
            <CustomTextField
              id="dateOfInspection"
              value={""}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              fullWidth
              readOnly
            />
          </Grid>
          <Grid item sm={2}>
            <CustomFormLabel sx={{ mt: 0 }} htmlFor="InspectorName">
              Inspector Name
            </CustomFormLabel>
          </Grid>
          <Grid item sm={4}>
            <CustomTextField
              id="InspectorName"
              value={""}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              fullWidth
              readOnly
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item sm={12} border="3px dotted #000" p={2} mb={2}>
            <Typography variant="h6">INSTRUCTIONS:</Typography>

            <Grid item sm={12}>
              This checklist is designed to assess the fire safety measures in
              the workplace. Carefully review each item and mark the
              corresponding checkbox to indicate compliance or note any
              observations and areas for improvement. Use the
              "Notes/Observations" section to provide additional details,
              corrective actions, and any required follow-up.
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AuditFormDownload;
