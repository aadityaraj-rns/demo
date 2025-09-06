import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import CreateIcon from "@mui/icons-material/Create";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  editAsset,
  getAllPlantNames,
  getProductsByCategory,
  getUniqueTagName,
} from "../../../api/admin/internal";
import { getMyCategorieNames } from "../../../api/organization/internal";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import CustomSelect from "../../common/InputBox/CustomSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";

const EditAsset = ({ onAssetEdit, asset }) => {
  const [modal, setModal] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [plants, setPlants] = useState([]);
  const [isPumpCategory, setIsPumpCategory] = useState(false);
  const [isFECategory, setIsFECategory] = useState(false);
  const [tags, setTags] = useState([]);
  const [isCustomTag, setIsCustomTag] = useState(false);
  const pumpCapacityUnit = ["LPM", "LPS", "M3/Hr", "GPM", "Dia"];
  const fireExtinguisherCapacityUnit = ["Kgs", "Ltrs"];
  const fireHydrantCapacityUnit = ["Dia", "Set", "Mtrs"];
  const allUnits = [
    ...pumpCapacityUnit,
    ...fireExtinguisherCapacityUnit,
    ...fireHydrantCapacityUnit,
  ];
  const [capacityUnits, setCapacityUnits] = useState(allUnits);

  const toggle = () => {
    setModal(!modal);
  };

  const fetchPlant = async () => {
    const response = await getAllPlantNames();
    if (response.status === 200) {
      setPlants(response.data.allPlants);
    }
  };

  const fetchProductCategories = async () => {
    const response = await getMyCategorieNames();
    if (response.status === 200) {
      setProductCategories(response.data.categories.categories);
    }
  };

  const fetchProductsByCategory = async (productCategoryId) => {
    const response = await getProductsByCategory(productCategoryId);
    if (response.status === 200) {
      setProducts(response.data.products);
    }
  };

  const fetchTag = async () => {
    const response = await getUniqueTagName();
    if (response.status === 200) {
      setTags(response.data);
    }
  };

  const AssetSchema = Yup.object().shape({
    status: Yup.string()
      .oneOf(["Warranty", "AMC", "In-House", "Deactive"], "Invalid status")
      .required("Required"),
    healthStatus: Yup.string().required(),
    plantId: Yup.string().required("Required"),
    building: Yup.string().required("Required"),
    productCategoryId: Yup.string().required("Required"),
    productId: Yup.string().required("Required"),
    type: Yup.string().required("Product type is required"),
    subType: Yup.string().optional(),
    capacity: Yup.number().required("Capacity is required"),
    capacityUnit: Yup.string().optional(),
    location: Yup.string().required("Location is required"),
    model: Yup.string().optional(),
    slNo: Yup.string().optional(),
    pressureRating: Yup.number().optional(),
    pressureUnit: Yup.string().optional(),
    moc: Yup.string().optional(),
    approval: Yup.string().optional(),
    fireClass: Yup.string(),
    manufacturingDate: Yup.string().required("Required"),
    installDate: Yup.string().required("Required"),
    suctionSize: Yup.string(),
    head: Yup.string(),
    rpm: Yup.string(),
    mocOfImpeller: Yup.string(),
    fuelCapacity: Yup.string(),
    flowInLpm: Yup.string(),
    housePower: Yup.string(),
    tag: Yup.string().optional(),
    manufacturerName: Yup.string().optional(),
    document1: Yup.mixed()
      .nullable()
      .test("fileSize", "Image size should be less than 2MB", (value) => {
        if (!value) return true;
        return value.size <= 2000000;
      }),
    document2: Yup.mixed()
      .nullable()
      .test("fileSize", "Image size should be less than 2MB", (value) => {
        if (!value) return true;
        return value.size <= 2000000;
      }),
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const formik = useFormik({
    initialValues: {
      status: asset.status,
      healthStatus: asset.healthStatus,
      plantId: asset.plantId._id,
      building: asset.building,
      productCategoryId: asset.productId?.categoryId?._id,
      productId: asset.productId._id,
      type: asset.type,
      subType: asset.subType,
      capacity: asset.capacity,
      capacityUnit: asset.capacityUnit,
      location: asset.location,
      model: asset.model,
      slNo: asset.slNo,
      pressureRating: asset.pressureRating,
      pressureUnit: asset.pressureUnit,
      moc: asset.moc,
      approval: asset.approval,
      fireClass: asset.fireClass,
      manufacturingDate: formatDate(asset.manufacturingDate),
      installDate: formatDate(asset.installDate),
      suctionSize: asset.suctionSize,
      head: asset.head,
      rpm: asset.rpm,
      mocOfImpeller: asset.mocOfImpeller,
      fuelCapacity: asset.fuelCapacity,
      flowInLpm: asset.flowInLpm,
      housePower: asset.housePower,
      tag: asset.tag,
      manufacturerName: asset.manufacturerName,
      document1: null,
      document2: null,
    },
    enableReinitialize: true,
    validationSchema: AssetSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append("_id", asset._id);
      formData.append("plantId", values.plantId);
      formData.append("building", values.building);
      formData.append("productCategoryId", values.productCategoryId);
      formData.append("productId", values.productId);
      formData.append("type", values.type);
      values.subType && formData.append("subType", values.subType);
      formData.append("capacity", values.capacity);
      values.capacityUnit &&
        formData.append("capacityUnit", values.capacityUnit);
      formData.append("location", values.location);
      formData.append("model", values.model);
      formData.append("slNo", values.slNo);
      {
        values.pressureRating &&
          formData.append("pressureRating", values.pressureRating);
      }
      formData.append("pressureUnit", values.pressureUnit);
      formData.append("moc", values.moc);
      formData.append("approval", values.approval);

      if (isFECategory) {
        formData.append("fireClass", values.fireClass);
      }

      formData.append(
        "manufacturingDate",
        new Date(values.manufacturingDate).toISOString()
      );
      formData.append(
        "installDate",
        new Date(values.installDate).toISOString()
      );

      if (isPumpCategory) {
        formData.append("suctionSize", values.suctionSize);
        formData.append("head", values.head);
        formData.append("rpm", values.rpm);
        formData.append("mocOfImpeller", values.mocOfImpeller);
        formData.append("flowInLpm", values.flowInLpm);
        formData.append("housePower", values.housePower);
        formData.append("fuelCapacity", values.fuelCapacity);
      }

      formData.append("tag", values.tag);
      formData.append("status", values.status);
      formData.append("healthStatus", values.healthStatus);
      formData.append("manufacturerName", values.manufacturerName);

      if (values.document1) {
        formData.append("document1", values.document1);
      }
      if (values.document2) {
        formData.append("document2", values.document2);
      }

      const response = await editAsset(formData);
      if (response.status === 200) {
        onAssetEdit();
        toggle();
        showAlert({
          text: "Asset details edited successfully",
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

  useEffect(() => {
    if (modal) {
      if (formik.values.productCategoryId) {
        const selectedCategory = productCategories.find(
          (category) =>
            category.categoryId._id === formik.values.productCategoryId
        );

        if (
          selectedCategory &&
          selectedCategory.categoryId.categoryName === "Pump Room"
        ) {
          setIsPumpCategory(true);
          setIsFECategory(false);
          setCapacityUnits(pumpCapacityUnit);
        } else if (
          selectedCategory &&
          selectedCategory.categoryId.categoryName === "Fire Extinguishers"
        ) {
          setIsFECategory(true);
          setIsPumpCategory(false);
          setCapacityUnits(fireExtinguisherCapacityUnit);
        } else if (
          selectedCategory &&
          selectedCategory?.categoryId?.categoryName?.startsWith("Fire Hydrant")
        ) {
          setIsPumpCategory(false);
          setIsFECategory(false);
          setCapacityUnits(fireHydrantCapacityUnit);
        }
      } else {
        setProducts([]);
        setIsPumpCategory(false);
        setIsFECategory(false);
      }
    }
  }, [
    formik.values.productCategoryId,
    productCategories,
    modal,
    fireExtinguisherCapacityUnit,
    fireHydrantCapacityUnit,
    pumpCapacityUnit,
  ]);

  useEffect(() => {
    const matched = products.find(
      (p) => p._id == formik.values.productId // ← or === p._id if you store _id
    );

    setProductVariants(matched?.variants || []);
  }, [formik.values.productId, modal, products]);

  useEffect(() => {
    const matched = products?.find(
      (p) => p?._id == formik?.values?.productId // ← or === p._id if you store _id
    );

    const subTypes = matched?.variants?.find(
      (v) => v?.type == formik.values.type
    );
    setSubTypes(subTypes?.subType || []);
  }, [formik.values.type, modal, products, formik?.values?.productId]);

  useEffect(() => {
    if (modal) {
      fetchProductCategories();
      fetchPlant();
      fetchTag();
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
      <Typography
        onClick={toggle}
        border={"1px solid"}
        borderRadius={"4px"}
        px={2}
      >
        Edit
      </Typography>
      {modal && (
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
            {"Edit Asset"}
            <IconButton aria-label="close" onClick={toggle}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container mt>
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    label={"Status"}
                    formik={formik}
                    getOptionLabel={(opt) => opt.name}
                    getValueId={(opt) => opt._id}
                    options={[
                      { _id: "Warranty", name: "Warranty" },
                      { _id: "AMC", name: "AMC" },
                      { _id: "In-House", name: "In-House" },
                      { _id: "Deactive", name: "Deactive" },
                    ]}
                    id="status"
                    name="status"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    label={"Health Status"}
                    formik={formik}
                    getOptionLabel={(opt) => opt.name}
                    getValueId={(opt) => opt._id}
                    options={[
                      { _id: "NotWorking", name: "NotWorking" },
                      { _id: "AttentionRequired", name: "AttentionRequired" },
                      { _id: "Healthy", name: "Healthy" },
                    ]}
                    id="healthStatus"
                    name="healthStatus"
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
                  <FormikTextField
                    formik={formik}
                    label="Building"
                    id="building"
                    placeholder="Enter Building Name"
                    mandatory={true}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    label="Product Category"
                    formik={formik}
                    id="productCategoryId"
                    name="productCategoryId"
                    options={productCategories}
                    disabled={true}
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
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    label={"Type"}
                    formik={formik}
                    options={productVariants}
                    id="type"
                    name="type"
                    getOptionLabel={(opt) => opt?.type}
                    getValueId={(opt) => opt?.type}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    label={"Sub Type"}
                    formik={formik}
                    options={subTypes}
                    id="subType"
                    name="subType"
                    getOptionLabel={(opt) => opt}
                    getValueId={(opt) => opt}
                    required={false}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Capacity"
                    id="capacity"
                    mandatory={true}
                    type="number"
                    unitId="capacityUnit"
                    unitOptions={[...capacityUnits, "NA"]}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Location"
                    id="location"
                    placeholder="Enter location name"
                    mandatory={true}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Model"
                    id="model"
                    placeholder="Enter Model name"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Sl no/ Part no"
                    id="slNo"
                    placeholder="Enter serial number"
                  />
                </Grid>
                {isFECategory && (
                  <Grid item xs={12} lg={6}>
                    <FormikTextField
                      formik={formik}
                      label="Fire Class / Rating"
                      id="fireClass"
                      placeholder="Enter Fire Class / Rating"
                    />
                  </Grid>
                )}
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Pressure Rating"
                    id="pressureRating"
                    placeholder="Enter Pressure Rating"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    label={"Pressure Unit"}
                    formik={formik}
                    options={[
                      { _id: "Kg/Cm2", label: "Kg/Cm2" },
                      { _id: "PSI", label: "PSI" },
                      { _id: "MWC", label: "MWC" },
                      { _id: "Bar", label: "Bar" },
                    ]}
                    id="pressureUnit"
                    name="pressureUnit"
                    required={false}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Material Of Construction (MOC)"
                    id="moc"
                    placeholder="Enter Material Of Construction"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Approval / Standards"
                    id="approval"
                    placeholder="Enter Approval / Standards"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    type="date"
                    formik={formik}
                    label="Manufacturing Date"
                    id="manufacturingDate"
                    mandatory={true}
                    inputProps={{
                      max: dayjs().format("YYYY-MM-DD"),
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    formik={formik}
                    label="Manufacturer Name"
                    id="manufacturerName"
                    placeholder="Enter manufacturer name"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormikTextField
                    type="date"
                    formik={formik}
                    label="Install Date"
                    id="installDate"
                    mandatory={true}
                    inputProps={{
                      min:
                        formik.values.manufacturingDate ||
                        dayjs().format("YYYY-MM-DD"),
                      max: dayjs().format("YYYY-MM-DD"),
                    }}
                  />
                </Grid>
                {isPumpCategory && (
                  <>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="Suction and Discharge Size in MM"
                        id="suctionSize"
                        placeholder="Enter Suction and Discharge Size in MM"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="Head: M"
                        id="head"
                        placeholder="Enter Head: M"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="Full Load Speed: (RPM)"
                        id="rpm"
                        placeholder="Enter Full Load Speed: (RPM)"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="MOC Of Impeller"
                        id="mocOfImpeller"
                        placeholder="Enter MOC Of Impeller"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="Flow in LPM"
                        id="flowInLpm"
                        placeholder="Enter Flow in LPM"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="Horse Power / KW"
                        id="housePower"
                        placeholder="Enter Horse Power / KW"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <FormikTextField
                        formik={formik}
                        label="Fuel Capacity: in LTRS"
                        id="fuelCapacity"
                        placeholder="Enter Fuel Capacity: in LTRS"
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} lg={6}>
                  {!isCustomTag ? (
                    <Autocomplete
                      id="tag"
                      size="small"
                      fullWidth
                      options={[
                        ...tags.map((tag) => ({ label: tag.tagName })),
                        { label: "Other (Add Custom Tag)" },
                      ]}
                      getOptionLabel={(option) => option.label}
                      value={
                        [
                          ...tags.map((tag) => ({ label: tag.tagName })),
                          { label: "Other (Add Custom Tag)" },
                        ].find((opt) => opt.label === formik.values.tag) || null
                      }
                      onChange={(event, newValue) => {
                        if (newValue?.label === "Other (Add Custom Tag)") {
                          setIsCustomTag(true);
                          formik.setFieldValue("tag", "");
                        } else {
                          setIsCustomTag(false);
                          formik.setFieldValue("tag", newValue?.label || "");
                        }
                      }}
                      onBlur={formik.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tag"
                          placeholder="Enter Tag"
                          error={
                            formik.touched.tag && Boolean(formik.errors.tag)
                          }
                          helperText={formik.touched.tag && formik.errors.tag}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.label}>
                          {option.label}
                        </Box>
                      )}
                    />
                  ) : (
                    <FormikTextField
                      formik={formik}
                      label="Tag"
                      id="tag"
                      placeholder="Enter Tag"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setIsCustomTag(false)}
                              edge="end"
                            >
                              <CreateIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label={"Document 1"}
                    id="document1"
                    name="document1"
                    inputProps={{
                      accept: "image/jpg,image/jpeg,image/png,application/pdf",
                    }}
                    type="file"
                    size="large"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => {
                      formik.setFieldValue(
                        "document1",
                        event.currentTarget.files[0]
                      );
                    }}
                    InputLabelProps={{ shrink: true }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.document1 &&
                      Boolean(formik.errors.document1)
                    }
                    helperText={
                      formik.touched.document1 && formik.errors.document1
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label={"Document 2"}
                    id="document2"
                    name="document2"
                    inputProps={{
                      accept: "image/jpg,image/jpeg,image/png,application/pdf",
                    }}
                    type="file"
                    size="large"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => {
                      formik.setFieldValue(
                        "document2",
                        event.currentTarget.files[0]
                      );
                    }}
                    InputLabelProps={{ shrink: true }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.document2 &&
                      Boolean(formik.errors.document2)
                    }
                    helperText={
                      formik.touched.document2 && formik.errors.document2
                    }
                  />
                </Grid>
              </Grid>
            </form>
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
      )}
    </>
  );
};

EditAsset.propTypes = {
  onAssetEdit: PropTypes.func,
  asset: PropTypes.object,
};

export default EditAsset;
