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
  IconButton,
  DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import { createIndustry } from "../../../../api/admin/internal";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const AddIndustry = ({ onIndustryAdded }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const stateFormSchema = Yup.object().shape({
    industryName: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      industryName: "",
    },
    enableReinitialize: true,
    validationSchema: stateFormSchema,
    onSubmit: async (values) => {
      const data = {
        industryName: values.industryName,
      };
      const response = await createIndustry(data);
      if (response.status === 200) {
        onIndustryAdded();
        setModal(!modal);
        showAlert({
          text: "Industry created successfully",
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
      <Box display="flex" justifyContent="flex-end" pb={1}>
        <Button color="primary" variant="contained" onClick={toggle}>
          + Create
        </Button>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="h5"
          sx={dialogTitleStyles}
        >
          {"Create Industry"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={2} container>
                <Grid item xs={12} lg={12}>
                  <FormLabel htmlFor="industryName">
                    Industry Name<span className="text-danger">*</span>
                  </FormLabel>
                  <TextField
                    id="industryName"
                    name="industryName"
                    size="large"
                    placeholder="Enter industry name"
                    variant="outlined"
                    fullWidth
                    value={formik.values.industryName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.industryName &&
                      Boolean(formik.errors.industryName)
                    }
                    helperText={
                      formik.touched.industryName && formik.errors.industryName
                    }
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} lg={12}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              type="submit"
              onClick={formik.handleSubmit}
              disabled={
                !formik.isValid ||
                formik.isSubmitting ||
                formik.values.industryName.trim() === ""
              }
            >
              Submit
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

AddIndustry.propTypes = {
  onIndustryAdded: PropTypes.func,
};

export default AddIndustry;
