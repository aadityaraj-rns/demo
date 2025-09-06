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
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  addAsset,
  getProductsByCategory,
  getAllPlantNames,
  getUniqueTagName,
} from "../../../api/admin/internal";
import { IconPlus } from "@tabler/icons";
import { getMyCategorieNames } from "../../../api/organization/internal";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import CustomSelect from "../../common/InputBox/CustomSelect";
import { showAlert } from "../../common/showAlert";
import FormikTextField from "../../common/InputBox/FormikTextField";

const AddAssest = ({ onAssetAdded }) => {
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

  const fetchTag = async () => {
    const response = await getUniqueTagName();
    if (response.status === 200) {
      setTags(response.data);
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
      setProducts(response?.data?.products);
    }
  };

  const AssetSchema = Yup.object().shape({
    status: Yup.string()
      .oneOf(["Warranty", "AMC", "In-House", "Deactive"], "Invalid status")
      .required("Status is required"),
    plantId: Yup.string().required("PlantName is required"),
    building: Yup.string().required("Building is required"),
    productCategoryId: Yup.string().required("Category is required"),
    productId: Yup.string().required("Product name is required"),
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
    manufacturingDate: Yup.date()
      .required("Manufacturing date is required")
      .max(new Date(), "Install date cannot be in the future"),
    installDate: Yup.date()
      .required("Install date is required")
      .min(
        Yup.ref("manufacturingDate"),
        "Install date cannot be before manufacturing date"
      )
      .max(new Date(), "Install date cannot be in the future"),
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
      .test("fileSize", "File size should be less than 2MB", function (value) {
        if (!value) return true; // if no file is selected, skip validation
        return value && value.size <= 2097152;
      }),
    document2: Yup.mixed()
      .nullable()
      .test("fileSize", "Image size should be less than 2MB", (value) => {
        if (!value) return true;
        return value.size <= 2000000;
      }),
  });

  const formik = useFormik({
    initialValues: {
      status: "",
      plantId: "",
      building: "",
      productCategoryId: "",
      productId: "",
      type: "",
      subType: "",
      capacity: "",
      capacityUnit: "",
      location: "",
      model: "",
      slNo: "",
      pressureRating: "",
      pressureUnit: "",
      moc: "",
      approval: "",
      fireClass: "",
      manufacturingDate: "",
      installDate: "",
      suctionSize: "",
      head: "",
      rpm: "",
      mocOfImpeller: "",
      fuelCapacity: "",
      flowInLpm: "",
      housePower: "",
      tag: "",
      manufacturerName: "",
      document1: null,
      document2: null,
    },
    enableReinitialize: true,
    validationSchema: AssetSchema,
    onSubmit: async (values, actions) => {
      const formData = new FormData();

      // Append regular fields to FormData
      formData.append("plantId", values.plantId);
      formData.append("building", values.building);
      formData.append("productCategoryId", values.productCategoryId);
      formData.append("productId", values.productId);
      formData.append("type", values.type);
      values.subType && formData.append("subType", values.subType);
      formData.append("capacity", values.capacity.toString());
      values.capacityUnit &&
        formData.append("capacityUnit", values.capacityUnit);
      formData.append("location", values.location);
      formData.append("model", values.model);
      formData.append("slNo", values.slNo);
      formData.append("pressureRating", values.pressureRating.toString());
      formData.append("pressureUnit", values.pressureUnit);
      formData.append("moc", values.moc);
      formData.append("approval", values.approval);
      formData.append("fireClass", values.fireClass || "");
      formData.append(
        "manufacturingDate",
        new Date(values.manufacturingDate).toISOString()
      );
      formData.append(
        "installDate",
        new Date(values.installDate).toISOString()
      );
      formData.append("suctionSize", values.suctionSize || "");
      formData.append("head", values.head || "");
      formData.append("rpm", values.rpm || "");
      formData.append("mocOfImpeller", values.mocOfImpeller || "");
      formData.append("fuelCapacity", values.fuelCapacity || "");
      formData.append("flowInLpm", values.flowInLpm || "");
      formData.append("housePower", values.housePower || "");
      formData.append("tag", values.tag);
      formData.append("status", values.status);
      formData.append("manufacturerName", values.manufacturerName);

      if (values.document1) {
        formData.append("document1", values.document1);
      }
      if (values.document2) {
        formData.append("document2", values.document2);
      }

      const response = await addAsset(formData);
      if (response.status === 200) {
        onAssetAdded();
        setModal(!modal);
        actions.resetForm();
        showAlert({
          text: "Asset created successfully",
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

  useEffect(() => {
    const matched = products.find(
      (p) => p._id == formik.values.productId // ← or === p._id if you store _id
    );
    setProductVariants(matched?.variants || []);
  }, [formik.values.productId, products]);

  useEffect(() => {
    const matched = products?.find(
      (p) => p?._id == formik?.values?.productId // ← or === p._id if you store _id
    );

    const subTypes = matched?.variants?.find(
      (v) => v?.type == formik.values.type
    );
    setSubTypes(subTypes?.subType || []);
  }, [formik.values.type]);

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

  useEffect(() => {
    if (formik.values.productCategoryId) {
      formik.values.capacityUnit = "";
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
  }, [formik.values.productCategoryId, productCategories]);

  return (
    <>
      <Button onClick={toggle} size="small" startIcon={<IconPlus />}>
        Create
      </Button>
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
            {"Create Asset"}
            <IconButton aria-label="close" onClick={toggle}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Grid spacing={3} container mt={0}>
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
                    ]}
                    id="status"
                    name="status"
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
                    label="Manufacturer Name"
                    id="manufacturerName"
                    placeholder="Enter manufacturer name"
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
                    size="small"
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
                    size="small"
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

AddAssest.propTypes = {
  onAssetAdded: PropTypes.func,
};
export default AddAssest;
