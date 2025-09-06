import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllPlantNames } from "../../../api/admin/internal";
import {
  editTechnician,
  getMyCategorieNames,
} from "../../../api/organization/internal";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import CustomMultiSelect from "../../common/InputBox/CustomMultiSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";
import CustomSelect from "../../common/InputBox/CustomSelect";

const TechnicianEdit = ({ onTechnicianEdit, technician }) => {
  const [modal, setModal] = useState(false);
  const [showVendorFields, setShowVendorFields] = useState(
    technician.technicianType === "Third Party"
  );

  const [categories, setCategories] = useState([]);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    if (modal) {
      fetchCategories();
      fetchPlants();
    }
  }, [modal]);

  const toggle = () => {
    setModal(!modal);
  };

  const fetchPlants = async () => {
    try {
      const response = await getAllPlantNames();
      if (response.status === 200) {
        setPlants(response.data.allPlants);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getMyCategorieNames();
      if (response.status === 200) {
        setCategories(response.data.categories.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const technicianFormSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    contactNo: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    plantId: Yup.array()
      .min(1, "At least one plant must be selected")
      .required("Plant Name is required"),
    categoryId: Yup.array()
      .min(1, "At least one category must be selected")
      .required("Category is required"),
    technicianType: Yup.string().required("Technician type is required"),
    venderName: Yup.string(),
    venderNumber: Yup.string().matches(
      /^\d{10}$/,
      "Contact number must be exactly 10 digits"
    ),
    venderEmail: Yup.string().email("Invalid email address"),
    venderAddress: Yup.string(),
    status: Yup.string().required("status is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: technician.userId?.name,
      contactNo: technician.userId?.phone,
      email: technician.userId?.email,
      plantId: technician.plantId.map((p) => p._id),
      categoryId: technician.categoryId.map((c) => c._id),
      technicianType: technician.technicianType,
      venderName: technician.venderName,
      venderNumber: technician.venderNumber,
      venderEmail: technician.venderEmail,
      venderAddress: technician.venderAddress,
      status: technician.userId?.status,
    },
    enableReinitialize: true,
    validationSchema: technicianFormSchema,
    onSubmit: async (values) => {
      const data = {
        _id: technician._id,
        name: values.name,
        contactNo: values.contactNo,
        plantId: values.plantId,
        categoryId: values.categoryId,
        technicianType: values.technicianType,
        ...(values.venderName && { venderName: values.venderName }),
        ...(values.venderNumber && { venderNumber: values.venderNumber }),
        ...(values.venderEmail && { venderEmail: values.venderEmail }),
        ...(values.venderAddress && { venderAddress: values.venderAddress }),
        status: values.status,
      };
      const response = await editTechnician(data);
      if (response.status === 200) {
        onTechnicianEdit();
        toggle();
        showAlert({
          text: "Technician details edited successfully",
          icon: "success",
        });
      } else {
        toggle();
        showAlert({
          text: response.data.message,
          icon: "error",
        });
      }
    },
  });

  useEffect(() => {
    setShowVendorFields(formik.values.technicianType == "Third Party");
  }, [formik.values.technicianType]);

  return (
    <>
      <Typography onClick={toggle}>Edit</Typography>
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
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Edit Technician"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid spacing={3} container mt>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"Status"}
                  formik={formik}
                  getOptionLabel={(opt) => opt.name}
                  getValueId={(opt) => opt._id}
                  options={[
                    { _id: "Active", name: "Active" },
                    { _id: "Deactive", name: "Deactive" },
                  ]}
                  id="status"
                  name="status"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  mandatory={true}
                  formik={formik}
                  label="Contact No"
                  id="contactNo"
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      formik.handleChange(e);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  mandatory={true}
                  formik={formik}
                  label="Name"
                  id="name"
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomMultiSelect
                  required={true}
                  id="plantId"
                  label="Plant"
                  formik={formik}
                  options={plants}
                  getOptionLabel={(option) => option.plantName}
                  getValueId={(option) => option._id}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomMultiSelect
                  required={true}
                  id="categoryId"
                  label="Category"
                  formik={formik}
                  options={categories}
                  getOptionLabel={(option) => option.categoryId.categoryName}
                  getValueId={(option) => option.categoryId._id}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label="Type"
                  id="technicianType"
                  name="technicianType"
                  formik={formik}
                  options={[
                    { label: "In House", value: "In House" },
                    { label: "Third Party", value: "Third Party" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  getValueId={(option) => option.value}
                />
              </Grid>
              {showVendorFields && (
                <>
                  <Grid item md={12}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "grey.300",
                      }}
                    >
                      Vendor Info
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormikTextField
                      formik={formik}
                      label="Name"
                      id="venderName"
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormikTextField
                      formik={formik}
                      label="Number"
                      id="venderNumber"
                      onChange={(e) => {
                        const { value } = e.target;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          formik.handleChange(e);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormikTextField
                      formik={formik}
                      label="Email"
                      id="venderEmail"
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormikTextField
                      formik={formik}
                      label="Address"
                      id="venderAddress"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </form>
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

TechnicianEdit.propTypes = {
  onTechnicianEdit: PropTypes.func,
  technician: PropTypes.object,
};

export default TechnicianEdit;
