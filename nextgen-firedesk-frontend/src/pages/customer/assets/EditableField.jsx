import React, { useState } from "react";
import { Grid, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

const EditableField = ({ label, initialValue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Add logic to save the value if needed
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Grid item sm={8} display="flex" alignItems="center" px={1}>
      {isEditing ? (
        <TextField
          variant="outlined"
          size="small"
          value={value}
          onChange={handleChange}
          autoFocus
          InputProps={{
            sx: { fontSize: 14 },
          }}
        />
      ) : (
        <Typography variant="subtitle2" fontWeight="400">
          {value}
        </Typography>
      )}
      <IconButton
        aria-label={isEditing ? "save" : "edit"}
        onClick={isEditing ? handleSaveClick : handleEditClick}
        size="small"
        style={{ marginLeft: 4, padding: 4 }}
      >
        {isEditing ? (
          <CheckIcon fontSize="small" />
        ) : (
          <EditIcon fontSize="small" />
        )}
      </IconButton>
    </Grid>
  );
};

export default EditableField;
