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
  Fab,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  editCategory,
  getAllServiceNames,
} from "../../../../api/admin/internal";
import { IconEdit } from "@tabler/icons";
import { dialogTitleStyles } from "../../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../../common/showAlert";

const CategoriesEdit = ({ onCategoryEdit, category }) => {
  const [modal, setModal] = useState(false);
  const [forms, setForms] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllServiceNames();
      if (response.status === 200) {
        setForms(response.data.serviceNames);
      }
    };
    fetchData();
  }, []);

  const categorySchema = Yup.object().shape({
    categoryName: Yup.string().required("Required"),
    formId: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      status: category.status,
      categoryName: category.categoryName,
      formId: category.formId?._id || "",
    },
    enableReinitialize: true,
    validationSchema: categorySchema,
    onSubmit: async (values, actions) => {
      const data = {
        _id: category._id,
        status: values.status,
        categoryName: values.categoryName,
        formId: values.formId,
      };
      const response = await editCategory(data);
      if (response.status === 200) {
        onCategoryEdit();
        toggle();
        actions.resetForm();
        showAlert({
          text: "Category details edited successfully",
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
      <Box>
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
            {"Edit Category"}
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
                      Category <span className="text-danger">*</span>
                    </FormLabel>
                    <TextField
                      id="categorieName"
                      name="categoryName"
                      size="large"
                      placeholder="Enter categorie name"
                      variant="outlined"
                      fullWidth
                      value={formik.values.categoryName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{ readOnly: true }}
                      error={
                        formik.touched.categoryName &&
                        Boolean(formik.errors.categoryName)
                      }
                      helperText={
                        formik.touched.categoryName &&
                        formik.errors.categoryName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>
                      Form <span className="text-danger">*</span>
                    </FormLabel>
                    <Select
                      id="formId"
                      name="formId"
                      fullWidth
                      variant="outlined"
                      value={formik.values.formId}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.formId && Boolean(formik.errors.formId)
                      }
                      helperText={formik.touched.formId && formik.errors.formId}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select One
                      </MenuItem>
                      {forms.map((form) => (
                        <MenuItem key={form._id} value={form._id}>
                          {form.serviceName}
                        </MenuItem>
                      ))}
                    </Select>
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

CategoriesEdit.propTypes = {
  onCategoryEdit: PropTypes.func,
  category: PropTypes.object,
};
export default CategoriesEdit;
