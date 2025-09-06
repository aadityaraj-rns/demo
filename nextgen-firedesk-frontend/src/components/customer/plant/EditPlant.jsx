import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  editPlant,
  getAllCity,
  getAllManagerName,
} from "../../../api/admin/internal";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CustomSelect from "../../common/InputBox/CustomSelect";
import { showAlert } from "../../common/showAlert";
import FormikTextField from "../../common/InputBox/FormikTextField";

const EditPlant = ({ onPlantEdit, plant }) => {
  const [modal, setModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [managers, setManagers] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});

  const toggle = () => {
    setModal(!modal);
  };

  const fetchData = async () => {
    const response = await getAllCity();
    if (response.status === 200) {
      setCities(response.data.allCity);
    }
  };
  const fetchManagers = async () => {
    const response = await getAllManagerName();
    if (response.status === 200) {
      setManagers(response.data.managers);
    }
  };

  useEffect(() => {
    if (modal) {
      fetchManagers();
      fetchData();
      // Generate previews for existing layout images if present
      const existingImagePreviews = {};
      plant.layouts.forEach((layout, index) => {
        if (layout.layoutImage) {
          existingImagePreviews[`layoutImage${index}`] = layout.layoutImage; // Assuming this contains the URL
        }
      });
      setImagePreviews(existingImagePreviews);
    }
  }, [plant, modal]);

  const handleImageChange = (event, imageKey) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(imageKey, file);
      setImagePreviews({
        ...imagePreviews,
        [imageKey]: URL.createObjectURL(file),
      });
    }
  };

  const plantFormSchema = Yup.object().shape({
    pumpIotDeviceId: Yup.string().optional(),
    plantName: Yup.string().required("Plant name is required"),
    address: Yup.string().required("Address is required"),
    cityId: Yup.string().required("City name is required"),
    managerId: Yup.string().notRequired(),
    plantImage: Yup.mixed()
      .nullable()
      .test("fileSize", "Image size should be less than 2MB", (value) => {
        // If no file is uploaded (value is null/undefined), skip validation
        if (!value) return true;
        return value.size <= 2000000;
      }),
    headerPressure: Yup.string().optional(),
    mainWaterStorage: Yup.string().optional(),
    primeWaterTankStorage: Yup.string().optional(),
    dieselStorage: Yup.string().optional(),
    pressureUnit: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      pumpIotDeviceId: plant.pumpIotDeviceId || "",
      plantName: plant.plantName || "",
      address: plant.address || "",
      cityId: plant.cityId || "",
      managerId: plant.managerId || "",
      plantImage: null, // Initially null to avoid sending if not updated
      headerPressure: plant.headerPressure || "",
      pressureUnit: plant.pressureUnit || "",
      mainWaterStorage: plant.mainWaterStorage || "",
      primeWaterTankStorage: plant.primeWaterTankStorage || "",
      dieselStorage: plant.dieselStorage || "",
    },
    enableReinitialize: true,
    validationSchema: plantFormSchema,
    onSubmit: async (values, actions) => {
      const formData = new FormData();
      formData.append("_id", plant._id);
      values.pumpIotDeviceId &&
        formData.append("pumpIotDeviceId", values.pumpIotDeviceId);
      formData.append("plantName", values.plantName);
      formData.append("address", values.address);
      formData.append("cityId", values.cityId);
      values.managerId && formData.append("managerId", values.managerId);
      values.plantImage && formData.append("plantImage", values.plantImage);
      values.headerPressure &&
        formData.append("headerPressure", values.headerPressure);
      values.pressureUnit &&
        formData.append("pressureUnit", values.pressureUnit);
      values.mainWaterStorage &&
        formData.append("mainWaterStorage", values.mainWaterStorage);
      values.primeWaterTankStorage &&
        formData.append("primeWaterTankStorage", values.primeWaterTankStorage);
      values.dieselStorage &&
        formData.append("dieselStorage", values.dieselStorage);

      const response = await editPlant(formData);
      if (response.status === 200) {
        onPlantEdit();
        setModal(!modal);
        setImagePreviews({});
        actions.resetForm();
        showAlert({
          text: "Plant details edited successfully",
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
      <Typography onClick={toggle}>Edit</Typography>
      <Dialog
        open={modal}
        onClose={toggle}
        fullWidth
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Edit Plant"}

          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mt>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Pump IOT Deviceid"
                  id="pumpIotDeviceId"
                />
              </Grid>
              {/* Plant Fields */}
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  mandatory={true}
                  formik={formik}
                  label="Name"
                  id="plantName"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  mandatory={true}
                  formik={formik}
                  label="Address"
                  id="address"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"City"}
                  formik={formik}
                  options={cities}
                  id="cityId"
                  name="cityId"
                  getOptionLabel={(opt) => opt.cityName}
                  getValueId={(opt) => opt._id}
                  createPath="/customer"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"Manager"}
                  formik={formik}
                  options={managers}
                  id="managerId"
                  name="managerId"
                  createPath="/customer/manager"
                  getOptionLabel={(opt) => opt.name}
                  getValueId={(opt) => opt._id}
                  required={false}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Header Pressure"
                  id="headerPressure"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"Pressure Unit"}
                  formik={formik}
                  options={[
                    { _id: "Kg/Cm2", name: "Kg/Cm2" },
                    { _id: "PSI", name: "PSI" },
                    { _id: "MWC", name: "MWC" },
                    { _id: "Bar", name: "Bar" },
                  ]}
                  id="pressureUnit"
                  name="pressureUnit"
                  getOptionLabel={(opt) => opt.name}
                  getValueId={(opt) => opt._id}
                  required={false}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Main Water Storage"
                  id="mainWaterStorage"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Prime Water Tank Storage"
                  id="primeWaterTankStorage"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Diesel Storage"
                  id="dieselStorage"
                  type="number"
                />
              </Grid>
              {/* Plant Image */}
              <Grid item xs={12} lg={6}>
                <TextField
                  label={"Plant Image"}
                  id="plantImage"
                  name="plantImage"
                  inputProps={{ accept: "image/jpg,image/jpeg,image/png" }}
                  type="file"
                  size="small"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => handleImageChange(event, "plantImage")}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.errors.plantImage && formik.touched.plantImage && (
                  <FormHelperText error>
                    {formik.errors.plantImage}
                  </FormHelperText>
                )}
                {imagePreviews.plantImage && (
                  <div className="pt-4 text-center">
                    <img
                      src={imagePreviews.plantImage}
                      width={150}
                      height={150}
                      alt="Plant Image Preview"
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
EditPlant.propTypes = {
  onPlantEdit: PropTypes.func.isRequired,
  plant: PropTypes.object.isRequired,
};

export default EditPlant;
