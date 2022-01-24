const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePostInput(data) {
  let errors = {};

  //check if data is string(even if its empty)
  data.text = isEmpty(data.text) ? "" : data.text;

  //empty
  if (validator.isEmpty(data.text)) {
    errors.password = "Text field is required";
  }

  //length
  if (!validator.isLength(data.text, { min: 6, max: 300 })) {
    if (data.password.length === 0) {
      errors.password = "Password field is required";
    } else {
      errors.password = "Post length must be 6 - 300 Characters";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
