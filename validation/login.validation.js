const validator = require("validator");
const isEmpty = require("./isEmpty");


module.exports = function validateLoginInput(data){
    let errors = {}
    
    //check if data is string(even if its empty)
    data.password = isEmpty(data.password) ? "" : data.password;
    data.email = isEmpty(data.email) ? "" : data.email;

    
    //check if string is email
    if(!validator.isEmail(data.email)){
        errors.email = "Email not valid"
    }

    //empty
    if(validator.isEmpty(data.password)){
        errors.password = "Password field is required"
    }
    if(validator.isEmpty(data.email)){
        errors.email = "Email field is required"
    }
       

    //length
    if(!validator.isLength(data.password,{min:6})){
        if(data.password.length === 0){
            errors.password = "Password field is required"
        }else{

            errors.password = "Password length must be 6 - 30"
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}