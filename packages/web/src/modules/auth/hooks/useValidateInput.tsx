import validator from "validator";
export const useValidateInput = (name: string, value: string) => {
  switch (name) {
    case "email":
      if (!validator.isEmail(value)) {
        return "Invalid email address.";
      }
      break;

    case "password":
      if (value.length < 6) {
        return "Password should be at least 6 characters.";
      }
      break;

    default:
      return;
  }
};
