export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phone = value.replace(/[^\d]/g, ""); // remove non-numeric
  const phoneLength = phone.length;

  if (phoneLength < 4) return phone;
  if (phoneLength < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
};
