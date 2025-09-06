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
  Checkbox,
  Fab,
  Autocomplete,
  FormControl,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  getAllActiveCategories,
  getActiveCities,
  editClient,
  getAllActiveIndustries,
} from "../../../../api/admin/internal";
import { IconEdit } from "@tabler/icons";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const EditClientModal = ({ client, onClientEdit }) => {
  const [modal, setModal] = useState(false);
  const [industryDatas, setIndustryDatas] = useState([]);
  const [cityDatas, setCityDatas] = useState([]);
  const [categories, setCategories] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllActiveIndustries();
      if (response.status === 200) {
        setIndustryDatas(response.data.allIndustry);
      }
      const response1 = await getAllActiveCategories();
      if (response1.status === 200) {
        setCategories(response1.data.allCategory);
      }
    };
    fetchData();
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const response = await getActiveCities();
    if (response.status === 200) {
      setCityDatas(response.data.cities);
    }
  };

  const clientSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    cityId: Yup.string().required("Required"),
    industryId: Yup.string(),
    categoryId: Yup.array().required("Required"),
    gst: Yup.string(),
    address: Yup.string(),
    pincode: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: client.name,
      branchName: client.branchName,
      cityId: client.cityId,
      industryId: client.industryId === null ? "" : client.industryId,
      categoryId: client.categoryId,
      status: client.status,
      gst: client.gst || "",
      address: client.address || "",
      pincode: client.pincode || "",
    },
    enableReinitialize: true,
    validationSchema: clientSchema,
    onSubmit: async (values, actions) => {
      const data = {
        _id: client._id,
        name: values.name,
        cityId: values.cityId,
        industryId: values.industryId === "" ? null : values.industryId,
        categoryId: values.categoryId,
        clientType: client.clientType,
        status: values.status,
        gst: values.gst,
        address: values.address,
        pincode: values.pincode,
      };

      const response = await editClient(data);
      if (response.status === 200) {
        onClientEdit();
        toggle();
        actions.resetForm();
        showAlert({
          text: "Client details edited successfully",
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

  return (
    <>
      <Box display="flex" justifyContent="flex-end" pb={1}>
        <Fab size="small" color="secondary" onClick={toggle}>
          <IconEdit size="16" />
        </Fab>
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
            Edit {client.clientType}
            <IconButton aria-label="close" onClick={toggle}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
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
                    <FormLabel>
                      Name <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id={`name`}
                      name={`name`}
                      size="large"
                      placeholder={`Enter ${client.clientType} name`}
                      variant="outlined"
                      fullWidth
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  {/* <Grid item xs={12} lg={12}>
                    <FormLabel>
                      Branch Name <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id="branchName"
                      name="branchName"
                      size="large"
                      placeholder="Enter branch name"
                      variant="outlined"
                      fullWidth
                      value={formik.values.branchName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.branchName &&
                        Boolean(formik.errors.branchName)
                      }
                      helperText={
                        formik.touched.branchName && formik.errors.branchName
                      }
                    />
                  </Grid> */}
                  <Grid item xs={12} lg={12}>
                    <FormLabel>Industry</FormLabel>
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
                    <FormLabel> GST Number </FormLabel>
                    <TextField
                      id={`gst`}
                      name={`gst`}
                      size="large"
                      placeholder="Enter GST Number"
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
                    <FormLabel> Address </FormLabel>
                    <TextField
                      id={`address`}
                      name={`address`}
                      size="large"
                      placeholder="Enter Address"
                      variant="outlined"
                      fullWidth
                      value={formik.values.address}
                      multiline
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
                    <FormLabel>Pincode</FormLabel>
                    <TextField
                      id={`pincode`}
                      name={`pincode`}
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
                      {/* <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectAll}
                            onChange={handleSelectAll}
                            name="selectAll"
                            color="primary"
                          />
                        }
                        label="Select All"
                      /> */}
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
                          // if (newValue.length === categories.length) {
                          //   setSelectAll(true);
                          // } else {
                          //   setSelectAll(false);
                          // }
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
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={formik.handleSubmit}
              type="submit"
              disabled={formik.isSubmitting}
            >
              Submit
            </Button>
            <Button variant="contained" color="error" onClick={toggle}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

EditClientModal.propTypes = {
  client: PropTypes.object,
  onClientEdit: PropTypes.func,
};

export default EditClientModal;
