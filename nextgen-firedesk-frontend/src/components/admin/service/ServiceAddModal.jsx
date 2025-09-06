import React from "react";
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
} from "@mui/material";
import { setService } from "../../../store/admin/service/ServiceSlice";
import { useSelector, useDispatch } from "react-redux";

const ServiceAddModal = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = React.useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const [values, setValues] = React.useState({
    productName: "",
    details: "",
    serviceFrequence: "",
    questions: "",
    remark: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setService(values));
    setModal(!modal);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" p={3} pb={1}>
        <Button color="primary" variant="contained" onClick={toggle}>
          Add New Service
        </Button>
        <Dialog
          open={modal}
          onClose={toggle}
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Add New Service"}
          </DialogTitle>
          <DialogContent>
            <Box mt={3}>
              <form onSubmit={handleSubmit}>
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>Product Name</FormLabel>
                    <Select
                      id="productName"
                      fullWidth
                      variant="outlined"
                      value={values.productName}
                      onChange={(e) =>
                        setValues({ ...values, productName: e.target.value })
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select One
                      </MenuItem>
                      <MenuItem value="Product1">Product1</MenuItem>
                      <MenuItem value="Product2">Product2</MenuItem>
                    </Select>
                    <FormLabel>Details</FormLabel>
                    <TextField
                      id="details"
                      size="large"
                      placeholder="Enter details name"
                      variant="outlined"
                      fullWidth
                      value={values.details}
                      onChange={(e) =>
                        setValues({ ...values, details: e.target.value })
                      }
                    />
                    <FormLabel>Service Frequence</FormLabel>
                    <Select
                      id="serviceFrequence"
                      fullWidth
                      variant="outlined"
                      value={values.serviceFrequence}
                      onChange={(e) =>
                        setValues({ ...values, serviceFrequence: e.target.value })
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Service Frequence
                      </MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                    </Select>
                    <FormLabel>Questions</FormLabel>
                    <TextField
                      id="questions"
                      size="large"
                      placeholder="Enter questions name"
                      variant="outlined"
                      fullWidth
                      value={values.questions}
                      onChange={(e) =>
                        setValues({ ...values, questions: e.target.value })
                      }
                    />
                    <FormLabel>Remark</FormLabel>
                    <TextField
                      id="remark"
                      size="large"
                      placeholder="Enter remark name"
                      variant="outlined"
                      fullWidth
                      value={values.remark}
                      onChange={(e) =>
                        setValues({ ...values, remark: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      type="submit"
                      disabled={
                        values.productName.length === 0 || values.details.length == 0||
                        values.serviceFrequence.length===0||
                        values.questions.length===0||
                        values.remark.length===0
                      }
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

export default ServiceAddModal;
