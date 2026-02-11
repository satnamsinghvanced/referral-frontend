export const EMAIL_REGEX =
  /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+)\.([a-zA-Z]{2,3})$/;
export const PHONE_REGEX = /^\(\d{3}\)\s\d{3}-\d{4}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const NAME_REGEX = /^[a-zA-Z\s'.-]+$/;
export const ZIP_CODE_REGEX = /^\d{5}$/;

export const ODD_PAGINATION_LIMIT = 9;
export const EVEN_PAGINATION_LIMIT = 10;
