import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  IconButton,
  Chip,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  editProduct,
  getAllActiveCategories,
} from "../../../api/admin/internal";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import * as Yup from "yup";
import { FieldArray, FormikProvider, getIn, useFormik } from "formik";
import CustomSelect from "../../common/InputBox/CustomSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import ImageUploadBox from "../../common/InputBox/ImageUploadBox";

const ProductEditModal = ({ product, onProductEdit }) => {
  const [modal, setModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageUploadingIndex, setImageUploadingIndex] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllActiveCategories();
      if (response.status === 200) {
        setCategories(response.data.allCategory);
      }
    };
    fetchData();
  }, [product]);

  const productSchema = Yup.object().shape({
    categoryId: Yup.string().required("Category is required"),
    productName: Yup.string().required("Category is required"),
    testFrequency: Yup.string().required("Category is required"),
    productVariants: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required("Type is required"),
        subType: Yup.array()
          .of(Yup.string().trim().required("Sub-type cannot be empty"))
          .optional(),
        description: Yup.string().required("Description is required"),
        image: Yup.string().url().required("Image is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      categoryId: product.categoryId._id,
      status: product.status,
      productName: product.productName,
      testFrequency: product.testFrequency,
      productVariants: product.variants,
    },
    enableReinitialize: true,
    validationSchema: productSchema,
    onSubmit: async (values, actions) => {
      const data = {
        _id: product._id,
        status: values.status,
        categoryId: values.categoryId,
        productName: values.productName,
        testFrequency: values.testFrequency,
        productVariants: values.productVariants,
      };
      try {
        const response = await editProduct(data);
        if (response.status == 200) {
          actions.resetForm();
          onProductEdit();
          toggle();
          showAlert({
            text: "Product details edited successfully",
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

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={toggle}>
          Edit
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
            variant="body2"
            sx={dialogTitleStyles}
          >
            {"Edit Product"}
            <IconButton aria-label="close" onClick={toggle}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormikProvider value={formik}>
              <form
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
                <Grid container spacing={3} mt>
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      label={"Status"}
                      formik={formik}
                      options={[
                        { _id: "Active", label: "Active" },
                        { _id: "Deactive", label: "Deactive" },
                      ]}
                      id={"status"}
                      name={"status"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}></Grid>
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      label={"Category"}
                      formik={formik}
                      options={categories}
                      id={"categoryId"}
                      name={"categoryId"}
                      getOptionLabel={(option) => option.categoryName || ""}
                      getValueId={(option) => option._id}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormikTextField
                      label={"Product Name"}
                      id="productName"
                      formik={formik}
                      mandatory={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FieldArray name="productVariants">
                      {({ push, remove }) => (
                        <>
                          {formik.values.productVariants.map(
                            (variant, index) => (
                              <Grid
                                container
                                spacing={1}
                                key={index}
                                sx={{
                                  border: "1px solid #ccc",
                                  pt: 1,
                                  pr: 0.3,
                                  my: 1,
                                  borderRadius: 0.5,
                                }}
                              >
                                <Grid item xs={12} md={6}>
                                  <FormikTextField
                                    label="Type"
                                    id={`productVariants.${index}.type`}
                                    name={`productVariants.${index}.type`}
                                    formik={formik}
                                    mandatory
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    multiple
                                    freeSolo
                                    size="small"
                                    options={[]}
                                    value={variant.subType}
                                    onChange={(_, newValue) =>
                                      formik.setFieldValue(
                                        `productVariants.${index}.subType`,
                                        newValue
                                      )
                                    }
                                    onBlur={() =>
                                      formik.setFieldTouched(
                                        `productVariants.${index}.subType`,
                                        true
                                      )
                                    }
                                    renderTags={(value, getTagProps) =>
                                      value.map((option, i) => (
                                        <Chip
                                          size="small"
                                          variant="outlined"
                                          label={option}
                                          {...getTagProps({ index: i })}
                                          key={i}
                                        />
                                      ))
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Sub Type"
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Add & press Enter"
                                        error={Boolean(
                                          getIn(
                                            formik.touched,
                                            `productVariants.${index}.subType`
                                          ) &&
                                            getIn(
                                              formik.errors,
                                              `productVariants.${index}.subType`
                                            )
                                        )}
                                        helperText={
                                          getIn(
                                            formik.touched,
                                            `productVariants.${index}.subType`
                                          ) &&
                                          getIn(
                                            formik.errors,
                                            `productVariants.${index}.subType`
                                          )
                                        }
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FormikTextField
                                    label="Description"
                                    id={`productVariants.${index}.description`}
                                    name={`productVariants.${index}.description`}
                                    formik={formik}
                                    mandatory
                                  />
                                </Grid>
                                {/* <Grid item xs={12} md={6}>
                                  {(!formik.values.productVariants?.[index]
                                    ?.image ||
                                    formik.values.productVariants[index]
                                      .image === "") && (
                                    <TextField
                                      size="small"
                                      InputLabelProps={{ shrink: true }}
                                      label={
                                        <>
                                          Image
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>
                                        </>
                                      }
                                      type="file"
                                      fullWidth
                                      inputProps={{
                                        accept:
                                          "image/png,image/jpeg,image/jpg",
                                      }}
                                      onChange={async (e) => {
                                        const file = e.currentTarget.files[0];
                                        if (!file) return;

                                        try {
                                          setImageUploadingIndex(index);
                                          const url =
                                            await uploadImageAndGetUrl(file);
                                          formik.setFieldValue(
                                            `productVariants.${index}.image`,
                                            url,
                                            true // run validation
                                          );
                                        } catch (err) {
                                          showAlert({
                                            text: err.message,
                                            icon: "error",
                                          });
                                        } finally {
                                          setImageUploadingIndex(null);
                                        }
                                      }}
                                      error={Boolean(
                                        formik.errors.productVariants?.[index]
                                          ?.image
                                      )}
                                      helperText={
                                        formik.errors.productVariants?.[index]
                                          ?.image
                                      }
                                    />
                                  )}

                                  <Box
                                    mt={1}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    gap={2}
                                  >
                                    {imageUploadingIndex === index ? (
                                      <CircularProgress size={24} />
                                    ) : (
                                      formik.values.productVariants?.[index]
                                        ?.image && (
                                        <Box
                                          sx={{
                                            position: "relative",
                                            width: 100,
                                            height: 100,
                                            "&:hover .delete-btn": {
                                              opacity: 1,
                                            },
                                          }}
                                        >
                                          <img
                                            src={
                                              formik.values.productVariants[
                                                index
                                              ].image
                                            }
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            style={{
                                              borderRadius: 4,
                                              objectFit: "cover",
                                            }}
                                          />
                                          <IconButton
                                            className="delete-btn"
                                            size="small"
                                            sx={{
                                              position: "absolute",
                                              top: 4,
                                              right: 4,
                                              backgroundColor:
                                                "rgba(255,255,255,0.8)",
                                              opacity: 0,
                                              transition: "opacity 0.3s",
                                              "&:hover": {
                                                backgroundColor:
                                                  "rgba(255,0,0,0.8)",
                                                color: "#fff",
                                              },
                                            }}
                                            onClick={() =>
                                              formik.setFieldValue(
                                                `productVariants.${index}.image`,
                                                ""
                                              )
                                            }
                                            title="Remove Image"
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      )
                                    )}
                                  </Box>
                                </Grid> */}
                                <Grid item xs={12} md={6}>
                                  <ImageUploadBox
                                    value={
                                      formik.values.productVariants[index].image
                                    }
                                    index={index}
                                    uploadingIndex={imageUploadingIndex}
                                    setUploadingIndex={setImageUploadingIndex}
                                    onChange={(url) =>
                                      formik.setFieldValue(
                                        `productVariants.${index}.image`,
                                        url,
                                        true
                                      )
                                    }
                                    error={Boolean(
                                      formik.errors.productVariants?.[index]
                                        ?.image
                                    )}
                                    helperText={
                                      formik.errors.productVariants?.[index]
                                        ?.image
                                    }
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  justifyContent="flex-end"
                                >
                                  {formik.values.productVariants.length > 1 && (
                                    <IconButton
                                      color="error"
                                      onClick={() => remove(index)}
                                    >
                                      <RemoveCircleOutline />
                                    </IconButton>
                                  )}
                                </Grid>
                              </Grid>
                            )
                          )}
                          <Grid container justifyContent="flex-end">
                            <IconButton
                              color="secondary"
                              onClick={() =>
                                push({
                                  type: "",
                                  description: "",
                                  image: null,
                                })
                              }
                            >
                              <AddCircleOutline />
                            </IconButton>
                          </Grid>
                        </>
                      )}
                    </FieldArray>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      label={"Test Frequency / HP Test"}
                      formik={formik}
                      options={[
                        { _id: "One Year", label: "One Year" },
                        { _id: "Two Years", label: "Two Years" },
                        { _id: "Three Years", label: "Three Years" },
                        { _id: "Five Years", label: "Five Years" },
                        { _id: "Ten Years", label: "Ten Years" },
                      ]}
                      id={"testFrequency"}
                      name={"testFrequency"}
                    />
                  </Grid>
                </Grid>
              </form>
            </FormikProvider>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              type="submit"
              onClick={formik.handleSubmit}
              disabled={formik.isSubmitting || imageUploadingIndex != null}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

ProductEditModal.propTypes = {
  product: PropTypes.object,
  onProductEdit: PropTypes.func,
};

export default ProductEditModal;
