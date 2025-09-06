import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { addManager } from "../../../api/admin/internal";
import { IconPlus } from "@tabler/icons";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { showAlert } from "../../common/showAlert";
import FormikTextField from "../../common/InputBox/FormikTextField";

const AddManager = ({ onManagerAdded }) => {
  const [modal, setModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const managerFormSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    contactNo: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      contactNo: "",
      email: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: managerFormSchema,
    onSubmit: async (values, actions) => {
      const data = {
        name: values.name,
        contactNo: values.contactNo,
        email: values.email,
        password: values.password,
      };
      const response = await addManager(data);
      if (response.status === 200) {
        onManagerAdded();
        setModal(!modal);
        actions.resetForm();
        showAlert({
          text: "Manager Created Successfully",
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
      <Box display="flex" justifyContent="flex-end" m={1}>
        <Button
          color="warning"
          size="small"
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
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Create New Manager"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container mt>
                <Grid item xs={12} md={6}>
                  <FormikTextField
                    formik={formik}
                    label="Name"
                    id="name"
                    mandatory={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormikTextField
                    formik={formik}
                    label="Contact No"
                    id="contactNo"
                    mandatory={true}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormikTextField
                    formik={formik}
                    label="Email"
                    id="email"
                    mandatory={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormikTextField
                    formik={formik}
                    label="Password"
                    id="password"
                    mandatory={true}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
            type="submit"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
AddManager.propTypes = {
  onManagerAdded: PropTypes.func.isRequired,
};

export default AddManager;
