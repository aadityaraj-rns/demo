import { useEffect, useState } from "react";
import {
  Box,
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
import { addTechnician, getAllPlantNames } from "../../../api/admin/internal";
import { getMyCategorieNames } from "../../../api/organization/internal";
import { IconPlus } from "@tabler/icons";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import CustomMultiSelect from "../../common/InputBox/CustomMultiSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";
import CustomSelect from "../../common/InputBox/CustomSelect";

const TechnicianAdd = ({ onTechnicianAdded }) => {
  const [modal, setModal] = useState(false);
  const [showVendorFields, setShowVendorFields] = useState(false);
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
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      contactNo: "",
      email: "",
      plantId: "",
      categoryId: [],
      technicianType: "",
      venderName: "",
      venderNumber: "",
      venderEmail: "",
      venderAddress: "",
    },
    enableReinitialize: true,
    validationSchema: technicianFormSchema,
    onSubmit: async (values, actions) => {
      const data = {
        name: values.name,
        contactNo: values.contactNo,
        email: values.email,
        plantId: values.plantId,
        categoryId: values.categoryId,
        technicianType: values.technicianType,
      };
      if (values.venderName && values.venderName.trim() !== "") {
        data.venderName = values.venderName;
        data.venderNumber = values.venderNumber;
        data.venderEmail = values.venderEmail;
        data.venderAddress = values.venderAddress;
      }
      const response = await addTechnician(data);
      if (response.status === 200) {
        onTechnicianAdded();
        actions.resetForm();
        toggle();
        showAlert({
          text: "Technician created successfully",
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
  useEffect(() => {
    setShowVendorFields(formik.values.technicianType == "Third Party");
  }, [formik.values.technicianType]);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" pb={1}>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={toggle}
        >
          <IconPlus size="20" className="pe-1" /> Create
        </Button>
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
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Create New Technician"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid spacing={3} container mt>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  mandatory={true}
                  formik={formik}
                  label="Name"
                  id="name"
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
                  label="Email"
                  id="email"
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

TechnicianAdd.propTypes = {
  onTechnicianAdded: PropTypes.func,
};
export default TechnicianAdd;
