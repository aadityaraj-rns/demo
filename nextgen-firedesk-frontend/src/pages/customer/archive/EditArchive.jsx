import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { editArchive } from "../../../api/organization/internal";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import CloseIcon from "@mui/icons-material/Close";
import { showAlert } from "../../../components/common/showAlert";
import PropTypes from "prop-types";
import FormikTextField from "../../../components/common/InputBox/FormikTextField";

const EditArchive = ({ onAssetAdded, archive }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const auditFormSchema = Yup.object().shape({
    archiveName: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      archiveName: archive?.archiveName,
      archiveDescription: archive?.archiveDescription,
      file: "",
    },
    enableReinitialize: true,
    validationSchema: auditFormSchema,
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append("_id", archive?._id);
      data.append("archiveName", values.archiveName);
      data.append("archiveDescription", values.archiveDescription);
      if (values.file) {
        data.append("file", values.file);
      }

      const response = await editArchive(data);
      if (response.status === 200) {
        toggle();
        onAssetAdded();
        resetForm();
        showAlert({
          text: "Archive details edited successfully",
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
      <Box>
        <Typography onClick={toggle}>Edit</Typography>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          color="primary"
          variant="h5"
          sx={dialogTitleStyles}
        >
          {"Edir Archive"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box maxHeight={400} overflow="auto">
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container mt>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Name"
                    id="archiveName"
                    mandatory={true}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <TextField
                    label={
                      <>
                        {"Document"}
                        <span style={{ color: "red" }}> *</span>
                      </>
                    }
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
                    helperText={formik.touched.file && formik.errors.file}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Description"
                    id="archiveDescription"
                    multiline
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EditArchive.propTypes = {
  onAssetAdded: PropTypes.func,
  archive: PropTypes.object,
};

export default EditArchive;
