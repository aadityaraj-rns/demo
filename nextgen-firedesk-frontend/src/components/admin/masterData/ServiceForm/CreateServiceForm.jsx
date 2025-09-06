import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import FormikTextField from "../../../common/InputBox/FormikTextField";

const CreateServiceForm = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const formSchema = Yup.object().shape({});
  const formik = useFormik({
    initialValues: {},
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: async (values, actions) => {
      console.log("hi", values, actions);
    },
  });

  return (
    <>
      <Button color="warning" variant="contained" onClick={toggle}>
        <Add fontSize="small" /> Create
      </Button>
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          open={modal}
          onClose={toggle}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            variant="h5"
            sx={dialogTitleStyles}
          >
            {"Create Form"}
            <IconButton aria-label="close" onClick={toggle}>
              <Close sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormikTextField
                  label={"Form Name"}
                  id={"groupName"}
                  mandatory
                  formik={formik}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              onClick={formik.handleSubmit}
              disabled={formik.isSubmitting}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default CreateServiceForm;
