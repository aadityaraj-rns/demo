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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllState, editCity } from "../../../../api/admin/internal";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const CityEdit = ({ onCityEdit, city }) => {
  const [stateDatas, setStateDatas] = useState([]);
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const cityFormSchema = Yup.object().shape({
    stateName: Yup.string().required("Required"),
    cityName: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      stateName: city.stateName,
      cityName: city.cityName,
      status: city.status,
    },
    enableReinitialize: true,
    validationSchema: cityFormSchema,
    onSubmit: async (values) => {
      const data = {
        _id: city._id,
        stateName: values.stateName,
        cityName: values.cityName,
        status: values.status,
      };
      try {
        const response = await editCity(data);

        if (response.status === 200) {
          onCityEdit();
          toggle();
          showAlert({
            text: "City details edited successfully",
            icon: "success",
          });
        } else {
          toggle();
          showAlert({
            text: response.data.message,
            icon: "error",
          });
        }
      } catch (error) {
        toggle();
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllState();
      if (response.status === 200) {
        setStateDatas(response.data.allState);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Box>
        <Button color="primary" variant="text" onClick={toggle}>
          Edit
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
            {"Edit New City"}
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
                      State <span className="text-danger">*</span>
                    </FormLabel>
                    <Select
                      id="stateName"
                      name="stateName"
                      fullWidth
                      variant="outlined"
                      value={formik.values.stateName}
                      onChange={formik.handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select One
                      </MenuItem>
                      {stateDatas.map((stateData) => (
                        <MenuItem
                          key={stateData.stateName}
                          value={stateData.stateName}
                        >
                          {stateData.stateName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.stateName && formik.touched.stateName && (
                      <div>{formik.errors.stateName}</div>
                    )}
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      City <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id="cityName"
                      name="cityName"
                      size="large"
                      placeholder="Enter city name"
                      variant="outlined"
                      fullWidth
                      value={formik.values.cityName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.cityName && formik.touched.cityName && (
                      <div>{formik.errors.cityName}</div>
                    )}
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      type="submit"
                      disabled={!formik.isValid || !formik.dirty}
                    >
                      Submit
                    </Button>
                    <Button variant="contained" color="error" onClick={toggle}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

CityEdit.propTypes = {
  onCityEdit: PropTypes.func,
  city: PropTypes.object,
};

export default CityEdit;
