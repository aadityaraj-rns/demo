import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { assetLatLongRemark } from "../../../api/organization/internal";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ChangeAssetLocation = ({ asset, onAssetEdit, plants }) => {
  const [modal1, setModal1] = useState(false);

  const navigate = useNavigate();

  const toggle1 = () => {
    setModal1(!modal1);
  };

  const AssetRemarkSchema = Yup.object().shape({
    plantId: Yup.string().required("Required"),
    building: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
    latLongRemark: Yup.string().required("Required"),
  });
  const formik = useFormik({
    initialValues: {
      location: asset.location,
      plantId: asset.plantId,
      building: asset.building,
      latLongRemark: "",
    },
    enableReinitialize: true,
    validationSchema: AssetRemarkSchema,
    onSubmit: async (values, actions) => {
      const data = {
        _id: asset._id,
        plantId: values.plantId,
        building: values.building,
        location: values.location,
        latLongRemark: values.latLongRemark,
      };

      const response = await assetLatLongRemark(data);
      if (response.status === 200) {
        setModal1(!modal1);
        onAssetEdit();
        actions.resetForm();
        // fetchAssets();
      } else {
        // setError(response.data.message);
        // setTimeout(() => setError(false), 6000);
      }
    },
  });
  return (
    <>
      <Button
        size="small"
        color="secondary"
        variant="outlined"
        onClick={toggle1}
        sx={{ marginRight: "5px" }}
      >
        Change location
      </Button>
      <Dialog
        open={modal1}
        onClose={toggle1}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="body2"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {"Remark For Change Location"}
          <IconButton aria-label="close" onClick={toggle1}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={
                      formik.touched.plantId && Boolean(formik.errors.plantId)
                    }
                  >
                    <FormLabel>
                      Plant <span className="text-danger">*</span>
                    </FormLabel>
                    <Select
                      id="plantId"
                      name="plantId"
                      value={formik.values.plantId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Plant Name"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Plant Name
                      </MenuItem>
                      {plants.map((plant, index) => (
                        <MenuItem key={index} value={plant._id}>
                          {plant.plantName}
                        </MenuItem>
                      ))}
                      <MenuItem onClick={() => navigate("/customer/plant")}>
                        <Button color="warning" sx={{ ml: "auto" }}>
                          Create
                        </Button>
                      </MenuItem>
                    </Select>
                    {formik.touched.plantId && formik.errors.plantId && (
                      <FormHelperText>{formik.errors.plantId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>
                    Building <span className="text-danger">*</span>
                  </FormLabel>
                  <TextField
                    id="building"
                    size="large"
                    placeholder="Enter Building Name"
                    variant="outlined"
                    fullWidth
                    value={formik.values.building}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.building && Boolean(formik.errors.building)
                    }
                    helperText={
                      formik.touched.building && formik.errors.building
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>
                    Location<span className="text-danger">*</span>
                  </FormLabel>
                  <TextField
                    id="location"
                    size="large"
                    placeholder="Enter Location Name"
                    variant="outlined"
                    fullWidth
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.location && Boolean(formik.errors.location)
                    }
                    helperText={
                      formik.touched.location && formik.errors.location
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>
                    Remark<span className="text-danger">*</span>
                  </FormLabel>
                  <TextField
                    id="latLongRemark"
                    size="large"
                    placeholder="Enter Remark Name"
                    variant="outlined"
                    fullWidth
                    value={formik.values.latLongRemark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.latLongRemark &&
                      Boolean(formik.errors.latLongRemark)
                    }
                    helperText={
                      formik.touched.latLongRemark &&
                      formik.errors.latLongRemark
                    }
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              type="submit"
              onClick={formik.handleSubmit}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Submit
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

ChangeAssetLocation.propTypes = {
  asset: PropTypes.object,
  onAssetEdit: PropTypes.func,
  plants: PropTypes.array,
};

export default ChangeAssetLocation;
