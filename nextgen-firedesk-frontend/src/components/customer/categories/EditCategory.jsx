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
import { editMyCategory } from "../../../api/organization/internal";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import FormikTextField from "../../common/InputBox/FormikTextField";
import CustomSelect from "../../common/InputBox/CustomSelect";

const EditCategory = ({ onCategoryEdit, category }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const categoryFormSchema = Yup.object().shape({
    startDate: Yup.date(),
    endDate: Yup.date(),
    inspection: Yup.string().required("Inspection Frequency is required"),
    testing: Yup.string().required("Testing Frequency is required"),
    maintenance: Yup.string().required("Maintenance Frequency is required"),
  });

  const formik = useFormik({
    initialValues: {
      startDate: category?.serviceDetails?.startDate || "",
      endDate: category?.serviceDetails?.endDate || "",
      inspection: category?.serviceDetails?.serviceFrequency.inspection || "",
      testing: category?.serviceDetails?.serviceFrequency.testing || "",
      maintenance: category?.serviceDetails?.serviceFrequency.maintenance || "",
    },
    enableReinitialize: true,
    validationSchema: categoryFormSchema,
    onSubmit: async (values, actions) => {
      const data = {
        categoryId: category.categoryId._id,
        startDate: values.startDate,
        endDate: values.endDate,
        inspection: values.inspection,
        testing: values.testing,
        maintenance: values.maintenance,
      };
      const response = await editMyCategory(data);
      if (response.status === 200) {
        onCategoryEdit();
        showAlert({
          text: "Category details edited successfully",
          icon: "success",
        });
        setModal(!modal);
        actions.resetForm();
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
      <Box display="flex" justifyContent="flex-start">
        <Typography
          variant="body2"
          color={"blue"}
          onClick={toggle}
          sx={{ cursor: "pointer" }}
        >
          Edit
        </Typography>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="h5"
          sx={dialogTitleStyles}
        >
          {"Edit Category"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container>
                <Grid item lg={6}>
                  <FormikTextField
                    label={"Start Date"}
                    id={"startDate"}
                    type="date"
                    value={
                      formik.values.startDate
                        ? dayjs(formik.values.startDate).format("YYYY-MM-DD")
                        : ""
                    }
                    formik={formik}
                  />
                </Grid>
                <Grid item lg={6}>
                  <FormikTextField
                    label={"End Date"}
                    id={"endDate"}
                    type="date"
                    value={
                      formik.values.startDate
                        ? dayjs(formik.values.endDate).format("YYYY-MM-DD")
                        : ""
                    }
                    formik={formik}
                  />
                </Grid>
                <Grid item lg={6}>
                  <CustomSelect
                    label={"Inspection Frequency"}
                    formik={formik}
                    options={[
                      { _id: "Weekly", label: "Weekly" },
                      { _id: "Monthly", label: "Monthly" },
                      { _id: "Quarterly", label: "Quarterly" },
                      { _id: "Yearly", label: "Yearly" },
                    ]}
                    id="inspection"
                    required={false}
                    name="inspection"
                    getOptionLabel={(opt) => opt.label}
                    getValueId={(opt) => opt._id}
                  />
                </Grid>
                <Grid item lg={6}>
                  <CustomSelect
                    label={"Testing Frequency"}
                    formik={formik}
                    options={[
                      { _id: "Weekly", label: "Weekly" },
                      { _id: "Monthly", label: "Monthly" },
                      { _id: "Quarterly", label: "Quarterly" },
                      { _id: "Yearly", label: "Yearly" },
                    ]}
                    id="testing"
                    required={false}
                    name="testing"
                    getOptionLabel={(opt) => opt.label}
                    getValueId={(opt) => opt._id}
                  />
                </Grid>
                <Grid item lg={6}>
                  <CustomSelect
                    label={"Maintenance Frequency"}
                    formik={formik}
                    options={[
                      { _id: "Quarterly", label: "Quarterly" },
                      { _id: "Half Year", label: "Half Year" },
                      { _id: "Yearly", label: "Yearly" },
                    ]}
                    id="maintenance"
                    name="maintenance"
                    required={false}
                    getOptionLabel={(opt) => opt.label}
                    getValueId={(opt) => opt._id}
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

EditCategory.propTypes = {
  onCategoryEdit: PropTypes.func,
  category: PropTypes.func,
};

export default EditCategory;
