import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";

const CustomMultiSelect = ({
  id,
  label,
  required = false,
  formik,
  options,
  getOptionLabel = (option) => option.label || "",
  getValueId = (option) => option._id,
}) => {
  return (
    <>
      <Autocomplete
        size="small"
        multiple
        id={id}
        name={id}
        options={options}
        getOptionLabel={getOptionLabel}
        value={options.filter((item) =>
          formik.values[id]?.includes(getValueId(item))
        )}
        onChange={(event, newValue) => {
          const selectedIds = newValue.map(getValueId);
          formik.setFieldValue(id, selectedIds);
        }}
        onBlur={formik.handleBlur}
        isOptionEqualToValue={(option, value) =>
          getValueId(option) === getValueId(value)
        }
        renderInput={(params) => (
          <TextField
            label={
              <>
                {label}
                {required && <span style={{ color: "red" }}> *</span>}
              </>
            }
            key={label}
            {...params}
            variant="outlined"
            placeholder={`Select ${label}`}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && formik.errors[id]}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    </>
  );
};

CustomMultiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.any,
  formik: PropTypes.shape({
    values: PropTypes.object.isRequired,
    errors: PropTypes.object,
    touched: PropTypes.object,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func,
  }).isRequired,
  options: PropTypes.array.isRequired,
  getOptionLabel: PropTypes.func,
  getValueId: PropTypes.func,
};

export default CustomMultiSelect;
