import { Box, Button, Grid, Typography } from "@mui/material";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import CustomSelect from "../../../components/common/InputBox/CustomSelect";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createOldService,
  getDetailsForAddServices,
  getServiceFormByAssetIdServiceTypeServiceFrequency,
} from "../../../api/organization/internal";
import FormikTextField from "../../../components/common/InputBox/FormikTextField";
import * as Yup from "yup";
import { showAlert } from "../../../components/common/showAlert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    to: "/customer/assets",
    title: "Assets",
  },
  {
    title: "Upload Services",
  },
];

const UploadOldServices = () => {
  const { assetId } = useParams();
  const [asset, setAsset] = useState();
  const [frequencies, setFrequencies] = useState([]);
  const [form, setForm] = useState({});

  const BulkServiceUploadSchema = Yup.object({
    status: Yup.string().required(),
    managerRemark: Yup.string().optional(),
    technicianRemark: Yup.string().optional(),
    serviceType: Yup.string().required(),
    frequency: Yup.string().required(),
    technician: Yup.string().required(),
    responses: Yup.array().of(
      Yup.object({
        question: Yup.string().required(),
        answer: Yup.string().required("Required"),
        note: Yup.string(), // optional
      })
    ),
    date: Yup.string().required("Required"),
  });
  const formik = useFormik({
    initialValues: {
      serviceType: "",
      managerRemark: "",
      technicianRemark: "",
      frequency: "",
      technician: "",
      status: "",
      responses: [],
      date: "",
    },
    enableReinitialize: true,
    validationSchema: BulkServiceUploadSchema,
    onSubmit: async (values, actions) => {
      const data = {
        date: values.date,
        assetId: assetId,
        status: values.status,
        managerRemark: values.managerRemark,
        technicianRemark: values.technicianRemark,
        serviceType: values.serviceType,
        serviceFrequency: values.frequency,
        technician: values.technician,
        responses: values.responses,
        sectionName: form?.name,
      };
      try {
        const response = await createOldService(data);
        if (response.status == 200) {
          actions.resetForm();
          showAlert({
            text: response.data.message,
            icon: "success",
          });
        } else {
          showAlert({
            text: response.data.message,
            icon: "error",
          });
        }
      } catch (error) {
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
      //   console.log("payload to API", values);
    },
  });
  const fetchData = async () => {
    try {
      const res = await getDetailsForAddServices(assetId);
      if (res.status == 200) {
        setAsset(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    {
      formik.values.serviceType == "inspection"
        ? setFrequencies([
            { _id: "Weekly", name: "Weekly" },
            { _id: "Monthly", name: "Monthly" },
            { _id: "Quarterly", name: "Quarterly" },
            { _id: "Yearly", name: "Yearly" },
          ])
        : formik.values.serviceType == "testing"
        ? setFrequencies([
            { _id: "Weekly", name: "Weekly" },
            { _id: "Monthly", name: "Monthly" },
            { _id: "Quarterly", name: "Quarterly" },
            { _id: "Yearly", name: "Yearly" },
          ])
        : formik.values.serviceType == "maintenance"
        ? setFrequencies([
            { _id: "Quarterly", name: "Quarterly" },
            { _id: "Half Year", name: "Half Year" },
            { _id: "Yearly", name: "Yearly" },
          ])
        : setFrequencies([]);
    }
  }, [formik.values.serviceType]);
  useEffect(() => {
    (async () => {
      if (formik.values.serviceType && formik.values.frequency && asset?._id) {
        try {
          const res = await getServiceFormByAssetIdServiceTypeServiceFrequency({
            assetId: asset._id,
            serviceType: formik.values.serviceType,
            serviceFrequency: formik.values.frequency,
          });
          setForm(res.data);
          // build one blank response for every question
          formik.setFieldValue(
            "responses",
            res.data.questions.map((q) => ({
              question: q?.question,
              answer: "",
              note: "",
            }))
          );
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [formik.values.serviceType, formik.values.frequency, asset?._id]);

  return (
    <PageContainer
      title="Assests Old Service Upload"
      description="this is for Upload Assests Old Service "
    >
      <Breadcrumb title="Assets" items={BCrumb} />
      <Box m={2}>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Grid spacing={2} container>
              <Grid item xs={12}>
                Create Old Service For {asset?.assetId}
              </Grid>
              <Grid item xs={12} lg={3}>
                <FormikTextField
                  type="date"
                  formik={formik}
                  label="Service Date"
                  id="date"
                  mandatory={true}
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <CustomSelect
                  label={"Status"}
                  formik={formik}
                  getOptionLabel={(opt) => opt.name}
                  getValueId={(opt) => opt._id}
                  options={[
                    { _id: "Completed", name: "Completed" },
                    { _id: "Rejected", name: "Rejected" },
                  ]}
                  id="status"
                  name="status"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <FormikTextField
                  formik={formik}
                  label="Technician Remark"
                  id="technicianRemark"
                  placeholder="Enter Technician Remark"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <FormikTextField
                  formik={formik}
                  label="Manager Remark"
                  id="managerRemark"
                  placeholder="Enter Manager Remark"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <CustomSelect
                  label={"Technician"}
                  formik={formik}
                  getOptionLabel={(opt) => opt?.name}
                  getValueId={(opt) => opt?._id}
                  options={asset?.technicianUserId || []}
                  id="technician"
                  name="technician"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <CustomSelect
                  label={"Service Type"}
                  formik={formik}
                  getOptionLabel={(opt) => opt.name}
                  getValueId={(opt) => opt._id}
                  options={[
                    { _id: "inspection", name: "Inspection" },
                    { _id: "testing", name: "Testing" },
                    { _id: "maintenance", name: "Maintenence" },
                  ]}
                  id="serviceType"
                  name="serviceType"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <CustomSelect
                  label={"Service Frequency"}
                  formik={formik}
                  getOptionLabel={(opt) => opt.name}
                  getValueId={(opt) => opt._id}
                  options={frequencies}
                  id="frequency"
                  name="frequency"
                />
              </Grid>
              {form && (
                <FieldArray name="responses">
                  {() => (
                    <Grid spacing={1} container m p>
                      <Grid item xs={12}>
                        <Typography variant="body1">{form?.name}</Typography>
                      </Grid>

                      {form?.questions?.map((q, idx) => (
                        <Grid container spacing={1} key={q?._id} p m>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              {idx + 1}
                              {". "}
                              {q?.question}
                            </Typography>
                          </Grid>

                          {/* answer */}
                          <Grid item xs={12} md={5}>
                            <CustomSelect
                              label={"Service Type"}
                              formik={formik}
                              getOptionLabel={(opt) => opt.name}
                              getValueId={(opt) => opt._id}
                              options={[
                                { _id: "Yes", name: "Yes" },
                                { _id: "No", name: "No" },
                              ]}
                              id={`responses[${idx}].answer`}
                              name={`responses[${idx}].answer`}
                            />
                          </Grid>

                          {/* note */}
                          <Grid item xs={12} md={5}>
                            <FormikTextField
                              formik={formik}
                              id={`responses[${idx}].note`}
                              name={`responses[${idx}].note`} // 👈 unique path
                              label="Note"
                              placeholder="Enter note"
                            />
                          </Grid>

                          {/* hidden question (Formik already has it, but keep it synced) */}
                          <input
                            type="hidden"
                            name={`responses[${idx}].question`}
                            value={q?.question}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </FieldArray>
              )}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={formik.handleSubmit}
              disabled={formik.isSubmitting}
              sx={{
                ml: "auto",
              }}
            >
              Submit
            </Button>
          </form>
        </FormikProvider>
      </Box>
    </PageContainer>
  );
};

export default UploadOldServices;
