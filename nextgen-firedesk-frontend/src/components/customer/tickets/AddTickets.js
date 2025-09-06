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
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  getAllAssetNamesByCategoryPlantId,
  getAllPlantNames,
} from "../../../api/admin/internal";
import {
  addTicket,
  getAllAssetCategories,
} from "../../../api/organization/internal";
import CloseIcon from "@mui/icons-material/Close";
import { IconMinus, IconPlus } from "@tabler/icons";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";
import CustomSelect from "../../common/InputBox/CustomSelect";
import CustomMultiSelect from "../../common/InputBox/CustomMultiSelect";
import FormikTextField from "../../common/InputBox/FormikTextField";

const AddTickets = ({ onTicketAdded, name }) => {
  const [modal, setModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  const fetchAssets = async (categoryId, plantId) => {
    try {
      const response = await getAllAssetNamesByCategoryPlantId(
        categoryId,
        plantId
      );
      if (response.status === 200) {
        setAssets(response.data.assets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlantNames = async () => {
    try {
      const response = await getAllPlantNames();
      if (response.status === 200) {
        setPlants(response.data.allPlants);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssetCategories = async () => {
    try {
      const response = await getAllAssetCategories();
      if (response.status === 200) {
        setCategories(response.data.assetCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (modal) {
      fetchPlantNames();
      fetchAssetCategories();
    }
  }, [modal]);

  const ticketFormSchema = Yup.object().shape({
    plantId: Yup.string().required("Plant is required"),
    categoryId: Yup.string().required("Category is required"),
    assetsId: Yup.array()
      .min(1, "At least one assets must be selected")
      .required("Asset Name is required"),
    taskNames: Yup.array()
      .of(Yup.string().optional()) // Validate each task name
      .min(1, "At least one task name is required"),
    taskDescription: Yup.string().optional(),
    targetDate: Yup.string().required("required"),
  });

  const formik = useFormik({
    initialValues: {
      plantId: "",
      categoryId: "",
      assetsId: [],
      taskNames: [""],
      taskDescription: "",
      targetDate: "",
    },
    enableReinitialize: true,
    validationSchema: ticketFormSchema,
    onSubmit: async (values, actions) => {
      const data = {
        plantId: values.plantId,
        assetsId: values.assetsId,
        ...(values.taskNames && { taskNames: values.taskNames }),
        taskDescription: values.taskDescription,
        targetDate: new Date(values.targetDate).toISOString(),
      };

      const response = await addTicket(data);
      if (response.status === 200) {
        onTicketAdded();
        toggle();
        actions.resetForm();
        showAlert({
          text: "Ticket created successfully",
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
    if (formik.values.categoryId && formik.values.plantId) {
      fetchAssets(formik.values.categoryId, formik.values.plantId);
    }
  }, [formik.values.categoryId, formik.values.plantId]);

  const handleAddTaskName = () => {
    formik.setFieldValue("taskNames", [...formik.values.taskNames, ""]);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" ml="auto">
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={toggle}
        >
          <IconPlus size="15" /> {name}
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
          color="primary"
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Create New Tickets"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid spacing={3} container mt>
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
                  label={"Category"}
                  formik={formik}
                  options={categories}
                  id="categoryId"
                  name="categoryId"
                  getOptionLabel={(opt) => opt.categoryName}
                  getValueId={(opt) => opt._id}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomMultiSelect
                  required={true}
                  id="assetsId"
                  label="Asset"
                  formik={formik}
                  options={assets}
                  getOptionLabel={(option) => option.assetId}
                  getValueId={(option) => option._id}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormikTextField
                  type="date"
                  formik={formik}
                  label="Target Date"
                  id="targetDate"
                  mandatory={true}
                  inputProps={{
                    min: dayjs().format("YYYY-MM-DD"),
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                {formik.values.taskNames.map((taskName, index) => {
                  const hasError =
                    formik.touched.taskNames &&
                    formik.touched.taskNames[index] &&
                    Boolean(
                      formik.errors.taskNames && formik.errors.taskNames[index]
                    );

                  const helperText =
                    formik.touched.taskNames &&
                    formik.touched.taskNames[index] &&
                    formik.errors.taskNames &&
                    formik.errors.taskNames[index];

                  return (
                    <Box key={index} mt={index !== 0 ? 2 : 0}>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label={"Task Name"}
                        fullWidth
                        size="small"
                        variant="outlined"
                        id={`taskName-${index}`}
                        name={`taskNames[${index}]`}
                        placeholder="Enter Task Name..."
                        value={taskName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={hasError}
                        helperText={helperText}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {formik.values.taskNames.length > 1 && (
                                <IconButton
                                  onClick={() => {
                                    const updatedTasks =
                                      formik.values.taskNames.filter(
                                        (_, i) => i !== index
                                      );
                                    formik.setFieldValue(
                                      "taskNames",
                                      updatedTasks
                                    );
                                  }}
                                  edge="end"
                                  size="small"
                                >
                                  <IconMinus size={18} />
                                </IconButton>
                              )}
                              {index === formik.values.taskNames.length - 1 && (
                                <IconButton
                                  onClick={handleAddTaskName}
                                  edge="end"
                                  size="small"
                                >
                                  <IconPlus size={18} />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  );
                })}
              </Grid>

              <Grid item xs={12} lg={6}>
                <FormikTextField
                  formik={formik}
                  label="Task Description"
                  id="taskDescription"
                  multiline
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
    </>
  );
};

AddTickets.propTypes = {
  onTicketAdded: PropTypes.func,
  name: PropTypes.string,
};

export default AddTickets;
