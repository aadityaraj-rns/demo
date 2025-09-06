import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  FormControl,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  getActiveCities,
  getAllActiveIndustries,
} from "../../../../api/admin/internal";

import {
  addClientByPartner,
  getActiveCategoriesForPartner,
} from "../../../../api/partner/internal";

import { IconUserPlus } from "@tabler/icons";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const AddClientModal = ({ onClientAdd }) => {
  const [modal, setModal] = useState(false);
  const [industryDatas, setIndustryDatas] = useState([]);
  const [cityDatas, setCityDatas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllActiveIndustries();
      if (response.status === 200) {
        setIndustryDatas(response.data.allIndustry);
      }
      const response1 = await getActiveCategoriesForPartner();
      // console.log("response1", response1);
      if (response1.status === 200) {
        // Extract categories from the nested structure
        const extractedCategories = response1.data.allCategory.map(
          (category) => ({
            _id: category.categoryId._id,
            categoryName: category.categoryId.categoryName,
          })
        );
        setCategories(extractedCategories);
      }
    };
    fetchData();
    fetchCities();
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allCategoryId = categories.map((category) => category._id);
      formik.setFieldValue("categoryId", allCategoryId);
    } else {
      formik.setFieldValue("categoryId", []);
    }
    setSelectAll(event.target.checked);
  };

  const fetchCities = async () => {
    const response = await getActiveCities();
    if (response.status === 200) {
      setCityDatas(response.data.cities);
    }
  };

  const clientSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    contactNo: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    cityId: Yup.string().required("Required"),
    industryId: Yup.string().required("Required"),
    categoryId: Yup.array().required("Required"),
    gst: Yup.string(),
    pincode: Yup.string().matches(/^\d{6}$/, "Pincode must be 6 digits"),
    address: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      contactNo: "",
      email: "",
      cityId: "",
      industryId: "",
      categoryId: [],
      gst: "",
      pincode: "",
      address: "",
    },
    enableReinitialize: true,
    validationSchema: clientSchema,
    onSubmit: async (values, actions) => {
      const data = {
        name: values.name,
        contactNo: values.contactNo,
        email: values.email,
        cityId: values.cityId,
        industryId: values.industryId,
        categoryId: values.categoryId,
        clientType: "organization",
        gst: values.gst,
        pincode: values.pincode,
        address: values.address,
      };
      const response = await addClientByPartner(data);
      if (response.status === 200) {
        onClientAdd();
        toggle();
        actions.resetForm();
        showAlert({
          text: "Client created successfully",
          icon: "success",
        });
      } else {
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
          <IconUserPlus size="20" className="pe-1" /> Create
        </Button>
        <Dialog
          open={modal}
          onClose={toggle}
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            variant="h5"
            sx={dialogTitleStyles}
          >
            {`Create New Customer`}
            <IconButton aria-label="close" onClick={toggle}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box mt={3}>
              <form onSubmit={formik.handleSubmit}>
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      Name <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id={`name`}
                      name={`name`}
                      size="large"
                      placeholder="Enter customer name"
                      variant="outlined"
                      fullWidth
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      Contact No <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id="contactNo"
                      name="contactNo"
                      type="text"
                      size="large"
                      placeholder="Enter contact no"
                      variant="outlined"
                      fullWidth
                      value={formik.values.contactNo}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          formik.handleChange(e);
                        }
                      }}
                      inputProps={{ maxLength: 10 }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.contactNo &&
                        Boolean(formik.errors.contactNo)
                      }
                      helperText={
                        formik.touched.contactNo && formik.errors.contactNo
                      }
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      Email <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id="email"
                      name="email"
                      type="email"
                      size="large"
                      placeholder="Enter email"
                      variant="outlined"
                      fullWidth
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      Industry <span className="text-danger">*</span>
                    </FormLabel>
                    <Select
                      id="industryId"
                      name="industryId"
                      fullWidth
                      variant="outlined"
                      value={formik.values.industryId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.industryId &&
                        Boolean(formik.errors.industryId)
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select One
                      </MenuItem>
                      {industryDatas.map((industryData) => (
                        <MenuItem
                          key={industryData._id}
                          value={industryData._id}
                        >
                          {industryData.industryName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.industryId && formik.errors.industryId && (
                      <Box color="error.main">{formik.errors.industryId}</Box>
                    )}
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      City <span className="text-danger">*</span>
                    </FormLabel>
                    <Select
                      id="cityId"
                      name="cityId"
                      fullWidth
                      variant="outlined"
                      value={formik.values.cityId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.cityId && Boolean(formik.errors.cityId)
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select One
                      </MenuItem>
                      {cityDatas.map((cityData) => (
                        <MenuItem key={cityData._id} value={cityData._id}>
                          {cityData.cityName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.cityId && formik.errors.cityId && (
                      <Box color="error.main">{formik.errors.cityId}</Box>
                    )}
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>Pincode</FormLabel>
                    <TextField
                      id="pincode"
                      name="pincode"
                      size="large"
                      placeholder="Enter Pincode"
                      variant="outlined"
                      fullWidth
                      value={formik.values.pincode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.pincode && Boolean(formik.errors.pincode)
                      }
                      helperText={
                        formik.touched.pincode && formik.errors.pincode
                      }
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>Address</FormLabel>
                    <TextField
                      id="address"
                      name="address"
                      size="large"
                      placeholder="Enter Address"
                      variant="outlined"
                      fullWidth
                      multiline
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.address && Boolean(formik.errors.address)
                      }
                      helperText={
                        formik.touched.address && formik.errors.address
                      }
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel> GST </FormLabel>
                    <TextField
                      id="gst"
                      name="gst"
                      size="large"
                      placeholder="Enter GST"
                      variant="outlined"
                      fullWidth
                      value={formik.values.gst}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.gst && Boolean(formik.errors.gst)}
                      helperText={formik.touched.gst && formik.errors.gst}
                    />
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={
                        formik.touched.categoryId &&
                        Boolean(formik.errors.categoryId)
                      }
                    >
                      <FormLabel>
                        Category <span className="text-danger">*</span>
                      </FormLabel>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectAll}
                            onChange={handleSelectAll}
                            name="selectAll"
                            color="primary"
                          />
                        }
                        label="Select All"
                      />
                      <Autocomplete
                        multiple
                        id="categoryId"
                        name="categoryId"
                        options={categories}
                        getOptionLabel={(option) => `${option.categoryName}`}
                        value={categories.filter((category) =>
                          formik.values.categoryId.includes(category._id)
                        )}
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "categoryId",
                            newValue.map((option) => option._id)
                          );
                          if (newValue.length === categories.length) {
                            setSelectAll(true);
                          } else {
                            setSelectAll(false);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select Category"
                            error={
                              formik.touched.categoryId &&
                              Boolean(formik.errors.categoryId)
                            }
                            helperText={
                              formik.touched.categoryId &&
                              formik.errors.categoryId
                            }
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li
                            {...props}
                            style={{ marginBottom: "5px", padding: "4px 0px" }}
                          >
                            <Checkbox checked={selected} />
                            {`${option.categoryName}`}
                          </li>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={toggle}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={formik.handleSubmit}
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

AddClientModal.propTypes = {
  onClientAdd: PropTypes.func,
};

export default AddClientModal;
