import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { getIn } from "formik";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CustomSelect = ({
  formik,
  required = true,
  options,
  id,
  name,
  label,
  createPath,
  placeholder = "Select One...",
  getOptionLabel = (option) => option.label || "",
  getValueId = (option) => option._id,
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Autocomplete
        size="small"
        id={id}
        options={options}
        getOptionLabel={getOptionLabel}
        value={
          options.find((opt) => getValueId(opt) === formik.values[name]) || null
        }
        onChange={(event, newValue) => {
          formik.setFieldValue(name, newValue ? getValueId(newValue) : "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        {...props}
        renderInput={(params) => (
          <TextField
            label={
              <>
                {label}
                {required && <span style={{ color: "red" }}> *</span>}
              </>
            }
            {...params}
            placeholder={placeholder}
            name={name}
            error={Boolean(
              getIn(formik.touched, name) && getIn(formik.errors, name)
            )}
            helperText={
              getIn(formik.touched, name) && getIn(formik.errors, name)
                ? getIn(formik.errors, name)
                : ""
            }
            InputLabelProps={{ shrink: true }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={getOptionLabel(option)}>
            {getOptionLabel(option)}
          </Box>
        )}
        ListboxProps={{
          style: { maxHeight: 200 },
        }}
        noOptionsText={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <span>No options found</span>
            {createPath && (
              <Button
                color="warning"
                size="small"
                onClick={() => navigate(createPath || "/")}
              >
                Create
              </Button>
            )}
          </Box>
        }
      />
    </>
  );
};

CustomSelect.propTypes = {
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  getOptionLabel: PropTypes.func,
  getValueId: PropTypes.func,
  formik: PropTypes.shape({
    setFieldTouched: PropTypes.any,
    values: PropTypes.object.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  options: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  createPath: PropTypes.string,
};

export default CustomSelect;
