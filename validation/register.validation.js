const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterationInput(data) {
  let errors = {};

  //check if data is string(even if its empty)
  data.name = isEmpty(data.name) ? "" : data.name;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password2 = isEmpty(data.password2) ? "" : data.password2;

  //check if string is email
  if (!validator.isEmail(data.email)) {
    errors.email = "Email not valid";
  }

  //empty
  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  //check if confirmed password is not empty
  if (validator.isEmpty(data.password)) {
    errors.password2 = "Password field is required";
  }

  //length
  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    if (data.name.length === 0) {
      errors.name = "Name field is required";
    } else {
      errors.name = "Length must be 2- 30";
    }
  }
  if (!validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password length must be 6 - 30";
  }

  //check if password is confirmed
  if (!validator.equals(data.password, data.password2)) {
    errors.password = "Password must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
