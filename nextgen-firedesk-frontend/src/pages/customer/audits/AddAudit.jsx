import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getAllPlantNames } from "../../../api/admin/internal";
import { auditForm } from "../../../api/organization/internal";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import { showAlert } from "../../../components/common/showAlert";
import PropTypes from "prop-types";
import FormikTextField from "../../../components/common/InputBox/FormikTextField";
import CustomSelect from "../../../components/common/InputBox/CustomSelect";

const AddAudit = ({ onAuditAdded }) => {
  const [plants, setPlants] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      const response = await getAllPlantNames();
      if (response.status === 200) {
        setPlants(response.data.allPlants);
      }
    };
    fetchPlant();
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const auditFormSchema = Yup.object().shape({
    nameOfAudit: Yup.string().required("Required"),
    plantId: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    auditorName: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      nameOfAudit: "",
      plantId: "",
      description: "",
      auditorName: "",
      file: "",
    },
    enableReinitialize: true,
    validationSchema: auditFormSchema,
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();

      data.append("nameOfAudit", values.nameOfAudit);
      data.append("plantId", values.plantId);
      data.append("description", values.description);
      data.append("auditorName", values.auditorName);
      if (values.file) {
        data.append("file", values.file);
      }

      const response = await auditForm(data);
      if (response.status === 200) {
        onAuditAdded();
        resetForm();
        toggle();
        showAlert({
          text: "Audit created successfully",
          icon: "success",
        });
      } else if (response.code === "ERR_BAD_REQUEST") {
        toggle();
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
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          color="primary"
          variant="h5"
          sx={dialogTitleStyles}
        >
          {"Create New Audit"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid spacing={3} container mt>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Name of Audit"
                  id="nameOfAudit"
                  mandatory={true}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"Plant"}
                  formik={formik}
                  options={plants}
                  id="plantId"
                  name="plantId"
                  getOptionLabel={(opt) => opt.plantName}
                  getValueId={(opt) => opt._id}
                  createPath="/customer/plant"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Description"
                  id="description"
                  mandatory={true}
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Auditor Name"
                  id="auditorName"
                  mandatory={true}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={"Document"}
                  InputLabelProps={{ shrink: true }}
                  type="file"
                  id="file"
                  name="file"
                  size="small"
                  placeholder="Enter file name"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("file", file);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.file && Boolean(formik.errors.file)}
                  helperText={
                    formik.touched.auditorName && formik.errors.auditorName
                  }
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            type="submit"
            disabled={formik.isSubmitting}
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
AddAudit.propTypes = {
  onAuditAdded: PropTypes.func,
};

export default AddAudit;
