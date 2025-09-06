import { useEffect, useState } from "react";
import GenerateExcel from "../../../pages/customer/assets/GenerateExcel";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  bulkUpload,
  getMyCategorieNames,
} from "../../../api/organization/internal";
import {
  getAllPlantNames,
  getProductsByCategory,
} from "../../../api/admin/internal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../../common/showAlert";
import PropTypes from "prop-types";
import { CloudUpload } from "@mui/icons-material";
import CustomSelect from "../../common/InputBox/CustomSelect";

const MySwal = withReactContent(Swal);

const BulkUpload = ({ onAssetAdded }) => {
  const [modal, setModal] = useState(false);
  const [plants, setPlants] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  const validationSchema = Yup.object({
    file: Yup.mixed()
      .required("File is required")
      .test(
        "fileFormat",
        "Only .xlsx files are allowed",
        (value) =>
          value &&
          value.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ),
    plantId: Yup.string().required("Plant name is required"),
    productCategoryId: Yup.string().required("Required"),
    productId: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      file: null,
      plantId: "",
      productCategoryId: "",
      productId: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("plantId", values.plantId);

      formData.append("productCategoryId", values.productCategoryId);
      formData.append("productId", values.productId);

      try {
        const response = await bulkUpload(formData);
        if (response.data.success) {
          actions.resetForm();
          setModal(!modal);
          onAssetAdded();
          showAlert({
            text: "Assets added successfully",
            icon: "success",
          });
          if (response.data.errors && response.data.errors.length > 0) {
            const formattedErrors = response.data.errors
              .map(
                (error) =>
                  `Line ${error.line}: ${error.error
                    .map((err) => `${err.message}`)
                    .join("; ")}`
              )
              .join("\n");

            MySwal.fire({
              title: "Upload Completed with Some Errors",
              html: `<pre>${formattedErrors}</pre>`,
              icon: "warning",
              confirmButtonText: "OK",
              customClass: {
                popup: "swal2-popup",
              },
            });
          }
        } else {
          setModal(!modal);
          const formattedErrors = response.data.errors
            .map((error) => `Line ${error.line}: ${error.error}`)
            .join("\n");

          // Show SweetAlert with errors
          MySwal.fire({
            title: "Upload Failed",
            html: `<pre>${formattedErrors}</pre>`,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "swal2-popup",
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const fetchProductCategories = async () => {
    const response = await getMyCategorieNames();
    if (response.status === 200) {
      const filteredCategories = response.data.categories.categories.filter(
        (item) => item.categoryId.categoryName !== "Pump Room"
      );

      setProductCategories(filteredCategories);
    }
  };

  const fetchPlant = async () => {
    const response = await getAllPlantNames();
    if (response.status === 200) {
      setPlants(response.data.allPlants);
    }
  };

  const fetchProductsByCategory = async (productCategoryId) => {
    const response = await getProductsByCategory(productCategoryId);
    if (response.status === 200) {
      setProducts(response.data.products);
    }
  };

  useEffect(() => {
    if (modal) {
      fetchProductCategories();
      fetchPlant();
    }
  }, [modal]);

  useEffect(() => {
    if (modal) {
      if (formik.values.productCategoryId) {
        fetchProductsByCategory(formik.values.productCategoryId);
      } else {
        setProducts([]);
      }
    }
  }, [formik.values.productCategoryId, modal]);

  return (
    <>
      <Button onClick={toggle} size="small" startIcon={<CloudUpload />}>
        Upload
      </Button>

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
          {"Bulk Upload"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} mt>
            <Grid
              item
              xs={12}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Typography variant="h6">
                Instructions for Bulk Upload of Assets
              </Typography>
              <GenerateExcel />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                1. Download the Sample Excel File:
              </Typography>
              <Typography variant="body2">
                Click on the link to download the sample Excel file named{" "}
                <b>sample.xlsx</b>. This file contains the required format for
                uploading your asset data.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">2. Enter Asset Data:</Typography>
              <Typography variant="body2">
                Open the downloaded <b>sample.xlsx</b> file. Fill in the data
                according to the provided headings. Ensure that you follow the
                format specified in the sample file for each column.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                <b>NOTE:</b>{" "}
                <span style={{ marginLeft: 8 }}>
                  The <b>fireClass</b> field is only required for fire
                  extinguishers.
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                3. Do Not Change the Headings:
              </Typography>
              <Typography variant="body2">
                It is crucial that you do not change the headings of the sample
                file. The headings must remain exactly as they are to ensure
                successful data import.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">4. Save Your Changes:</Typography>
              <Typography variant="body2">
                After entering your asset data, save the changes to the Excel
                file. Ensure that the file is still saved in the <b>.xlsx</b>{" "}
                format.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">5. Upload the File:</Typography>
              <Typography variant="body2">
                Navigate to the bulk upload section of the web application.
                Click on the <b>{"'Upload'"}</b> button, select the modified{" "}
                <b>sample.xlsx</b> file from your device, and confirm the
                upload.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                6. Review Upload Confirmation:
              </Typography>
              <Typography variant="body2">
                After the upload is complete, you will receive a confirmation
                message indicating the success of the upload. Please wait until
                the success message appears before proceeding.
              </Typography>
            </Grid>
          </Grid>
          <form onSubmit={formik.handleSubmit}>
            <Grid spacing={3} container mt>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={"File"}
                  InputLabelProps={{ shrink: true }}
                  id="file"
                  name="file"
                  inputProps={{ accept: ".xlsx" }}
                  type="file"
                  size="small"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("file", file); // Set file value to Formik
                  }}
                  error={formik.touched.file && Boolean(formik.errors.file)}
                  helperText={formik.touched.file && formik.errors.file}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"Plant"}
                  formik={formik}
                  options={plants}
                  id="plantId"
                  name="plantId"
                  getOptionLabel={(opt) => opt.plantName}
                  getValueId={(opt) => opt._id}
                  createPath="/customer/plant"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label="Product Category"
                  formik={formik}
                  id="productCategoryId"
                  name="productCategoryId"
                  options={productCategories}
                  getOptionLabel={(opt) => opt.categoryId.categoryName}
                  getValueId={(opt) => opt.categoryId._id}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomSelect
                  label={"Product"}
                  formik={formik}
                  options={products}
                  id="productId"
                  name="productId"
                  getOptionLabel={(opt) => opt.productName}
                  getValueId={(opt) => opt._id}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} lg={12}>
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

BulkUpload.propTypes = {
  onAssetAdded: PropTypes.func,
};
export default BulkUpload;
