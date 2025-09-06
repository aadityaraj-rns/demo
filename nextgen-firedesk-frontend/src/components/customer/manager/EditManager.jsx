import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { editManager } from "../../../api/admin/internal";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import CustomSelect from "../../common/InputBox/CustomSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";

const EditManager = ({ onManagerEdit, manager }) => {
  // const [error, setError] = useState("");
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const managerFormSchema = Yup.object().shape({
    status: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: manager.name,
      status: manager.status,
    },
    enableReinitialize: true,
    validationSchema: managerFormSchema,
    onSubmit: async (values, actions) => {
      const data = {
        _id: manager._id,
        name: values.name,
        status: values.status,
      };
      const response = await editManager(data);
      if (response.status === 200) {
        onManagerEdit();
        actions.resetForm();
        setModal(!modal);
        showAlert({
          text: "Manager details edited successfully",
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
      <Box display="flex" justifyContent="flex-end">
        <Typography onClick={toggle}>Edit</Typography>
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
          {"Edit New Manager"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container>
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
                    formik={formik}
                    label="Name"
                    id="name"
                    mandatory={true}
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
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EditManager.propTypes = {
  onManagerEdit: PropTypes.func,
  manager: PropTypes.object,
};

export default EditManager;
