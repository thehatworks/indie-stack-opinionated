/* eslint-disable no-useless-escape */
// MH: why is no useless escape complaining about this?
const emailValidator = /^[^@]+@[^@\.]+(:?\.[^@\.]+)*$/;
/* eslint-enable no-useless-escape */

export const validateEmail = (email: string | null) => {
  if (email === null || email.length === 0) {
    return ["Email address required"];
  }
  if (!emailValidator.exec(email)) {
    return ["Please use a real email address"];
  }

  return [];
};

export const validatePassword = (password: string | null) =>
  password === null || password.length === 0
    ? ["Password required"]
    : password.length < 8
    ? ["Password is too short"]
    : [];
