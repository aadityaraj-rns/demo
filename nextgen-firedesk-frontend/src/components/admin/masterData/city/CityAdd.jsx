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
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllState, addCity } from "../../../../api/admin/internal";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const CityAdd = ({ onCityAdded }) => {
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
      stateName: "",
      cityName: "",
    },
    enableReinitialize: true,
    validationSchema: cityFormSchema,
    onSubmit: async (values) => {
      const data = {
        stateName: values.stateName,
        cityName: values.cityName,
      };
      try {
        const response = await addCity(data);

        if (response.status === 200) {
          onCityAdded();
          toggle();
          showAlert({
            text: "City created successfully",
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
    <Box display="flex" justifyContent="flex-end" pb={1}>
      <Button color="primary" variant="contained" onClick={toggle}>
        + Create
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
          {"Add New City"}
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
                    State <span className="text-danger">*</span>
                  </FormLabel>
                  <Select
                    id="stateName"
                    name="stateName"
                    fullWidth
                    variant="outlined"
                    value={formik.values.stateName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.stateName &&
                      Boolean(formik.errors.stateName)
                    }
                    helperText={
                      formik.touched.stateName && formik.errors.stateName
                    }
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
                    error={
                      formik.touched.cityName && Boolean(formik.errors.cityName)
                    }
                    helperText={
                      formik.touched.cityName && formik.errors.cityName
                    }
                  />
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
  );
};

CityAdd.propTypes = {
  onCityAdded: PropTypes.func,
};
export default CityAdd;
