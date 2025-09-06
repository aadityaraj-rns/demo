import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  FormLabel,
  DialogContent,
  Grid,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { editIndustry } from "../../../../api/admin/internal";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const EditIndustry = ({ onIndustryEdit, industry }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const industryFormSchema = Yup.object().shape({
    industryName: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      industryName: industry.industryName,
      status: industry.status,
    },
    enableReinitialize: true,
    validationSchema: industryFormSchema,
    onSubmit: async (values) => {
      const data = {
        _id: industry._id,
        industryName: values.industryName,
        status: values.status,
      };
      const response = await editIndustry(data);
      if (response.status === 200) {
        onIndustryEdit();
        setModal(!modal);
        showAlert({
          text: "Industry details edited successfully",
          icon: "success",
        });
      } else {
        setModal(!modal);
        showAlert({
          text: response.data.message,
          icon: "error",
        });
      }
    },
  });

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Typography onClick={toggle}>Edit</Typography>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Edit Industry"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={12}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    id="status"
                    name="status"
                    fullWidth
                    variant="outlined"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    helpertext={formik.touched.status && formik.errors.status}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select One
                    </MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Deactive">Deactive</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel htmlFor="industryName">
                    Industry <span className="text-danger">*</span>
                  </FormLabel>
                  <TextField
                    id="industryName"
                    name="industryName"
                    size="large"
                    placeholder="Enter Industry Name"
                    variant="outlined"
                    fullWidth
                    value={formik.values.industryName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.industryName &&
                      Boolean(formik.errors.industryName)
                    }
                    helpertext={
                      formik.touched.industryName && formik.errors.industryName
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      !formik.isValid ||
                      formik.isSubmitting ||
                      formik.values.industryName.trim() === ""
                    }
                  >
                    Submit
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

EditIndustry.propTypes = {
  onIndustryEdit: PropTypes.func,
  industry: PropTypes.object,
};

export default EditIndustry;
