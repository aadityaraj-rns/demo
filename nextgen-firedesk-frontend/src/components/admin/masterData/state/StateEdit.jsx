import React from "react";
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
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { editStateName } from "../../../../api/admin/internal";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const StateEdit = ({ onStateEdit, state }) => {
  const [modal, setModal] = React.useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const stateFormSchema = Yup.object().shape({
    stateName: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      stateName: state.stateName,
      status: state.status,
    },
    enableReinitialize: true,
    validationSchema: stateFormSchema,
    onSubmit: async (values) => {
      const data = {
        _id: state._id,
        stateName: values.stateName,
        status: values.status,
      };
      const response = await editStateName(data);
      if (response.status === 200) {
        onStateEdit();
        setModal(!modal);
        showAlert({
          text: "State details edited successfully",
          icon: "success",
        });
      } else if (response.code === "ERR_BAD_REQUEST") {
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
      <Box>
        <Button color="warning" variant="contained" onClick={toggle}>
          Edit
        </Button>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Add New State"}
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
                    helperText={formik.touched.status && formik.errors.status}
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
                  <FormLabel htmlFor="stateName">
                    State <span className="text-danger">*</span>
                  </FormLabel>
                  <TextField
                    id="stateName"
                    name="stateName"
                    size="large"
                    placeholder="Enter state"
                    variant="outlined"
                    fullWidth
                    value={formik.values.stateName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.stateName &&
                      Boolean(formik.errors.stateName)
                    }
                    helperText={
                      formik.touched.stateName && formik.errors.stateName
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
                      formik.values.stateName.trim() === ""
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

StateEdit.propTypes = {
  onStateEdit: PropTypes.func,
  state: PropTypes.object,
};
export default StateEdit;
