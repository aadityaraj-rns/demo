import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Fab,
} from "@mui/material";
import { IconEye } from "@tabler/icons";
import CloseIcon from "@mui/icons-material/Close";
import ViewTextInput from "../../../forms/theme-elements/ViewTextInput";
import PropTypes from "prop-types";

const CategoriesViewModal = ({ category, triggerComponent }) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      {triggerComponent ? (
        <span onClick={toggleModal}>{triggerComponent}</span>
      ) : (
        <Fab
          size="small"
          color="primary"
          onClick={toggleModal}
          sx={{ marginRight: 2 }}
        >
          <IconEye size="16" />
        </Fab>
      )}

      <Dialog open={modal} onClose={toggleModal} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          View Category
          <IconButton aria-label="close" onClick={toggleModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box padding="8px">
            <Grid container>
              <Grid item xs={12}>
                <ViewTextInput
                  label="Category Name:"
                  value={category?.categoryName}
                />
              </Grid>
              <Grid item xs={12}>
                <ViewTextInput
                  label="Form Name:"
                  value={category?.formId?.serviceName}
                />
              </Grid>
              <Grid item xs={12}>
                <ViewTextInput label="Status:" value={category?.status} />
              </Grid>
              <Grid item xs={12}>
                <ViewTextInput
                  label="Created At:"
                  value={category?.createdAt}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
CategoriesViewModal.propTypes = {
  category: PropTypes.any,
  triggerComponent: PropTypes.any,
};
export default CategoriesViewModal;
