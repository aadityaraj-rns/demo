import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CustomSelect from "../../common/InputBox/CustomSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";
import CustomMultiSelect from "../../common/InputBox/CustomMultiSelect";
import { Close } from "@mui/icons-material";
import { showAlert } from "../../common/showAlert";
import { useEffect, useState } from "react";
import {
  getAllPlantNames,
} from "../../../api/admin/internal";
import { useFormik } from "formik";
import {
  editGroupService,
  getFilteredAssetsByMultiCategorySinglePlant,
  getFormIds,
  getMyCategorieNames,
} from "../../../api/organization/internal";
import * as Yup from "yup";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const EditGroupService = ({ row, fetchData }) => {
  const [modal, setModal] = useState(false);
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formIds, setFormIds] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  const fetchPlants = async () => {
    try {
      const response = await getAllPlantNames();
      if (response.status === 200) {
        setPlants(response.data.allPlants);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getMyCategorieNames();
      if (response.status === 200) {
        setCategories(response.data.categories.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFormIds = async () => {
    try {
      const response = await getFormIds();
      if (response.status == 200) {
        setFormIds(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (modal) {
      fetchPlants();
      fetchCategories();
      fetchFormIds();
    }
  }, [modal]);
  const groupFormSchema = Yup.object().shape({
    groupName: Yup.string().required("Group name is required"),
    formId: Yup.string().required("Form is required"),
    plantId: Yup.string().required("Select a plant"),
    assetsId: Yup.array()
      .min(1, "At least one asset must be selected")
      .required("Asset name is required"),
    categoryIds: Yup.array().notRequired(),
    description: Yup.string().notRequired(),
    startDate: Yup.date(),
    endDate: Yup.date(),
    inspection: Yup.string().notRequired(),
    testing: Yup.string().notRequired(),
    maintenance: Yup.string().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      groupName: row?.groupName || "",
      formId: row?.formId?._id || "",
      plantId: row?.plantId?._id || "",
      categoryIds: row?.assetsId?.map((a) => a?.productCategoryId) || [],
      description: row?.description || "",
      assetsId: row?.assetsId?.map((a) => a?._id) || [],
      startDate: row.startDate || "",
      endDate: row.endDate || "",
      inspection: row.inspection || "",
      testing: row.testing || "",
      maintenance: row.maintenance || "",
    },
    enableReinitialize: true,
    validationSchema: groupFormSchema,
    onSubmit: async (values, actions) => {
      const response = await editGroupService({ _id: row._id, ...values });
      if (response.status == 200) {
        toggle();
        actions.resetForm();
        showAlert({
          text: "Service-group successfully submited",
          icon: "success",
        });
        fetchData();
      } else {
        toggle();
        showAlert({
          text: response.data.message,
          icon: "error",
        });
      }
    },
  });

  useEffect(() => {
    const fetchAssets = async () => {
      if (!formik.values.plantId) return;
      try {
        formik.setFieldValue(
          "assetsId",
          row?.assetsId?.map((a) => a?._id) || []
        );
        const payload = {
          plantId: formik.values.plantId,
          categoryIds: formik.values.categoryIds,
        };
        const response = await getFilteredAssetsByMultiCategorySinglePlant(
          payload
        );
        if (response.status === 200) {
          setAssets(response.data.assets || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssets();
  }, [formik.values.plantId, formik.values.categoryIds]);
  return (
    <>
      <Typography onClick={toggle}>Edit</Typography>
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
            {"Edit Group"}
            <IconButton aria-label="close" onClick={toggle}>
              <Close sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={0}>
              <Grid item md={6}>
                <FormikTextField
                  label={"Group Name"}
                  id={"groupName"}
                  mandatory
                  formik={formik}
                />
              </Grid>
              <Grid item md={6}>
                <CustomSelect
                  label={"Plant"}
                  formik={formik}
                  options={plants}
                  id="plantId"
                  name="plantId"
                  getOptionLabel={(opt) => opt.plantName}
                  getValueId={(opt) => opt._id}
                  createPath="/customer/plant"
                  disabled
                />
              </Grid>
              <Grid item md={6}>
                <CustomMultiSelect
                  id="categoryIds"
                  label="Category"
                  formik={formik}
                  options={categories}
                  getOptionLabel={(option) =>
                    option.categoryId?.categoryName || ""
                  }
                  getValueId={(option) => option.categoryId?._id}
                />
              </Grid>
              <Grid item md={6}>
                <CustomMultiSelect
                  id="assetsId"
                  label="Assets"
                  required={true}
                  formik={formik}
                  options={assets}
                  getOptionLabel={(option) => option.assetId || ""}
                  getValueId={(option) => option._id}
                />
              </Grid>
              <Grid item lg={6}>
                <CustomSelect
                  label={"Service Form"}
                  formik={formik}
                  options={formIds}
                  id="formId"
                  required={false}
                  name="formId"
                  getOptionLabel={(opt) => opt.serviceName}
                  getValueId={(opt) => opt._id}
                />
              </Grid>
              <Grid item md={6}>
                <FormikTextField
                  multiline
                  label={"Description"}
                  id={"description"}
                  formik={formik}
                />
              </Grid>
              <Grid item md={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ borderBottom: "1px solid", borderColor: "grey.300" }}
                >
                  Service
                </Typography>
              </Grid>
              <Grid item md={6}>
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
              <Grid item md={6}>
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
              <Grid item md={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ borderBottom: "1px solid", borderColor: "grey.300" }}
                >
                  Frequency
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <CustomSelect
                  label={"Inspection"}
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
              <Grid item lg={4}>
                <CustomSelect
                  label={"Testing"}
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
              <Grid item lg={4}>
                <CustomSelect
                  label={"Maintenance"}
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
EditGroupService.propTypes = {
  row: PropTypes.object,
  fetchData: PropTypes.func,
};
export default EditGroupService;
