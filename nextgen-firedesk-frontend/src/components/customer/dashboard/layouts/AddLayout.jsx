import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // FormLabel,
  Grid,
  IconButton,
  // TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addLayoutInplant } from "../../../../api/organization/internal";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";
import ImageUploadBox from "../../../common/InputBox/ImageUploadBox";
import FormikTextField from "../../../common/InputBox/FormikTextField";

const AddLayout = ({ selectedPlantId, fetchPlats }) => {
  const [openModal, setOpenModal] = useState(false);
  const [imageUploading, setImageUploading] = useState(null);

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };
  const plantLayoutSchema = Yup.object().shape({
    plantLayoutName: Yup.string().required("Required"),
    plantLayoutImage: Yup.mixed().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      plantLayoutName: "",
      plantLayoutImage: null,
    },
    enableReinitialize: true,
    validationSchema: plantLayoutSchema,
    onSubmit: async (values, actions) => {
      const data = {
        _id: selectedPlantId,
        plantLayoutName: values.plantLayoutName,
        plantLayoutImage: values.plantLayoutImage,
      };
      const formData = new FormData();
      formData.append("_id", selectedPlantId);
      formData.append("plantLayoutName", values.plantLayoutName);
      formData.append("plantLayoutImage", values.plantLayoutImage);
      try {
        const response = await addLayoutInplant(data);
        if (response.status === 200) {
          fetchPlats();
          actions.resetForm();
          // setImagePreview(null);
          setOpenModal(false);
          showAlert({
            text: "Layout created successfully",
            icon: "success",
          });
        } else {
          setOpenModal(false);
          showAlert({
            text: response.data.message,
            icon: "error",
          });
        }
      } catch (error) {
        setOpenModal(false);
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
    },
  });

  return (
    <>
      <Button
        variant="contained"
        sx={{ ml: "auto", whiteSpace: "nowrap" }}
        onClick={toggleModal}
      >
        Add Layout
      </Button>

      <Dialog
        container={document.fullscreenElement || undefined}
        open={openModal}
        onClose={toggleModal}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Add Plant Layout"}
          <IconButton aria-label="close" onClick={toggleModal}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={12}>
                <ImageUploadBox
                  value={formik.values.plantLayoutImage}
                  index={1}
                  uploadingIndex={imageUploading}
                  setUploadingIndex={setImageUploading}
                  onChange={(url) =>
                    formik.setFieldValue(`plantLayoutImage`, url, true)
                  }
                  error={Boolean(formik.errors.plantLayoutImage)}
                  helperText={formik.errors.plantLayoutImage}
                />
              </Grid>
              <Grid item sm={12}>
                <FormikTextField
                  label={"Layout Name"}
                  id="plantLayoutName"
                  formik={formik}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid item xs={12} lg={12}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                type="submit"
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
AddLayout.propTypes = {
  selectedPlantId: PropTypes.object,
  fetchPlats: PropTypes.func,
};

export default AddLayout;
