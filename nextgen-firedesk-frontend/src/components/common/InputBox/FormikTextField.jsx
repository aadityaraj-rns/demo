// import { TextField, InputAdornment, MenuItem, Select } from "@mui/material";
// import PropTypes from "prop-types";

// const FormikTextField = ({
//   label,
//   id,
//   formik,
//   mandatory,
//   unitId,
//   unitOptions = [],
//   ...props
// }) => {
//   return (
//     <TextField
//       InputLabelProps={{ shrink: true }}
//       label={
//         <>
//           {label}
//           {mandatory && <span style={{ color: "red" }}> *</span>}
//         </>
//       }
//       size="small"
//       id={id}
//       name={id}
//       placeholder={`Enter ${label}`}
//       fullWidth
//       variant="outlined"
//       value={formik.values[id]}
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       error={
//         (formik.touched[id] && Boolean(formik.errors[id])) ||
//         (unitId && Boolean(formik.errors[unitId]))
//       }
//       helperText={
//         (formik.touched[id] && formik.errors[id]) ||
//         (unitId && formik.errors[unitId])
//       }
//       InputProps={{
//         endAdornment: unitId && (
//           <InputAdornment position="end">
//             <Select
//               size="small"
//               value={formik.values[unitId]}
//               onChange={formik.handleChange}
//               name={unitId}
//               displayEmpty
//               variant="standard"
//               disableUnderline
//             >
//               <MenuItem value="" disabled>
//                 Unit
//               </MenuItem>
//               {unitOptions.map((option) => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </Select>
//           </InputAdornment>
//         ),
//       }}
//       {...props}
//     />
//   );
// };

// FormikTextField.propTypes = {
//   labelColor: PropTypes.string,
//   mandatory: PropTypes.bool,
//   id: PropTypes.string,
//   label: PropTypes.string,
//   formik: PropTypes.shape({
//     handleChange: PropTypes.func,
//     values: PropTypes.object.isRequired,
//     touched: PropTypes.object,
//     errors: PropTypes.object,
//     handleBlur: PropTypes.func,
//   }).isRequired,
//   unitId: PropTypes.string,
//   unitOptions: PropTypes.arrayOf(PropTypes.string),
// };

// export default FormikTextField;

import { TextField, InputAdornment, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import { getIn } from "formik";

const FormikTextField = ({
  label,
  id,
  formik,
  mandatory,
  unitId,
  unitOptions = [],
  ...props
}) => {
  const fieldError = getIn(formik.errors, id);
  const fieldTouched = getIn(formik.touched, id);
  const isError = Boolean(fieldTouched && fieldError);

  return (
    <TextField
      InputLabelProps={{ shrink: true }}
      label={
        <>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </>
      }
      size="small"
      id={id}
      name={id}
      placeholder={`Enter ${label}`}
      fullWidth
      variant="outlined"
      value={getIn(formik.values, id) || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={isError}
      helperText={isError && fieldError}
      InputProps={{
        endAdornment: unitId && (
          <InputAdornment position="end">
            <Select
              size="small"
              value={formik.values[unitId]}
              onChange={formik.handleChange}
              name={unitId}
              displayEmpty
              variant="standard"
              disableUnderline
            >
              <MenuItem value="" disabled>
                Unit
              </MenuItem>
              {unitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

FormikTextField.propTypes = {
  labelColor: PropTypes.string,
  mandatory: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({
    handleChange: PropTypes.func,
    values: PropTypes.object.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object,
    handleBlur: PropTypes.func,
  }).isRequired,
  unitId: PropTypes.string,
  unitOptions: PropTypes.arrayOf(PropTypes.string),
};

export default FormikTextField;
