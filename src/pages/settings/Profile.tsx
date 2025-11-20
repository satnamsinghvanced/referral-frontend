import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useFetchUser, useUpdateUser } from "../../hooks/settings/useUser";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useSpecialties } from "../../hooks/useCommon";
import { useDispatch } from "react-redux";
import { updateUserFirstName } from "../../store/authSlice";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { EMAIL_REGEX, PHONE_REGEX } from "../../consts/consts";

// 1. Define the type for the form fields
interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceName: string;
  medicalSpecialty: string;
  image: File | string | undefined; // Allow File object, string (for URL/name), or undefined
}

const fields = [
  { name: "firstName", label: "First Name", type: "text", isRequired: true },
  { name: "lastName", label: "Last Name", type: "text", isRequired: false },
  { name: "email", label: "Email Address", type: "email", isRequired: true },
  { name: "phone", label: "Phone Number", type: "tel", isRequired: false },
  {
    name: "practiceName",
    label: "Practice Name",
    type: "text",
    isRequired: true,
  },
];

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required").max(50),
  lastName: Yup.string().required("Last name is required").max(50),
  email: Yup.string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Invalid email format"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
  practiceName: Yup.string().required("Practice name is required"),
  medicalSpecialty: Yup.string().required("Specialty is required"),
  // 1. UPDATED: Add custom validation test for file type and size
  image: Yup.mixed<File | string>()
    .nullable()
    .test(
      "fileType",
      "Only JPG, JPEG, or PNG formats are accepted.",
      (value) => {
        if (!value) return true; // Allow null/undefined/empty string (no change)

        // If it's a string, assume it's an existing URL/path and pass
        if (typeof value === "string") return true;

        // Check file type for uploaded file (File object)
        const supportedFormats = ["image/jpeg", "image/png"];
        return supportedFormats.includes(value.type);
      }
    )
    .test("fileSize", "Image file is too large (max 1MB).", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 1048576; // 1MB in bytes
    }) as Yup.Schema<File | string | undefined | null>, // Cast back to full type
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId || "";

  const { data: fetchedUser } = useFetchUser(userId);
  const { data: specialties } = useSpecialties();
  const { mutate: updateUser, isPending } = useUpdateUser(userId);

  const [previewUrl, setPreviewUrl] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  );

  useEffect(() => {
    if (fetchedUser?.image) {
      setPreviewUrl(
        `${
          fetchedUser.image.includes("http")
            ? ""
            : `${import.meta.env.VITE_IMAGE_URL}/`
        }${fetchedUser.image}`
      );
    }
  }, [fetchedUser]);

  // 2. Pass ProfileFormValues as the generic type to useFormik
  const formik = useFormik<ProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      firstName: fetchedUser?.firstName || "Dr. Sarah",
      lastName: fetchedUser?.lastName || "Martinez",
      email: fetchedUser?.email || "sarah.martinez@tangeloortho.com",
      phone: fetchedUser?.phone
        ? formatPhoneNumber(fetchedUser.phone)
        : "(123) 456-7890",
      practiceName: fetchedUser?.practiceName || "Tangelo Orthodontics",
      medicalSpecialty: fetchedUser?.medicalSpecialty || "",
      image: fetchedUser?.image,
    },
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      // The 'image' field can be a File or a string (URL/name), but your mutation expects a string.
      // If a File is present, you would typically upload it here and get the resulting string URL/path.
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        practiceName: values.practiceName,
        medicalSpecialty: values.medicalSpecialty,
        image: (values.image as string) || "",
      };
      updateUser(data, {
        onSuccess(data) {
          dispatch(updateUserFirstName({ firstName: data.firstName }));
          console.log("User updated successfully", data);
        },
      });
    },
  });

  // 3. Update handleImageChange type to React.ChangeEvent<HTMLInputElement>
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Set field value and run validation
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true, false); // Mark touched to show error immediately

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      // Reset preview if file is cleared
      setPreviewUrl(
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
      );
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isValid,
    dirty,
  } = formik;

  // 4. Update the key access type for errors and touched
  type FormKey = keyof ProfileFormValues;
  const isDisabled = !isValid || !dirty || isPending;

  return (
    <>
      <div className="p-4 bg-background border border-foreground/10 rounded-lg">
        <form onSubmit={handleSubmit}>
          <h4 className="flex gap-2 items-center mb-4">
            <FiUser className="w-4 h-4" />
            <span className="text-sm !font-extralight">
              Profile Information
            </span>
          </h4>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={previewUrl}
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover"
            />
            {/* <div>
                     
            <Input
              size="sm"
              // type="file"
              // Set the accepted file types for browser filtering
              accept="image/jpeg,image/png"
              className="w-fit shadow-none"
              onChange={handleImageChange}
              variant="bordered"
            />
            {/* 5. Update error access with specific type checking */}
            {/* {touched.image && errors.image && (
              <p className="text-xs text-red-500">{errors.image as string}</p>
            )} */}
            {/* UPDATED: Corrected accepted file types */}
            {/* <p className="text-xs mt-1">JPG, JPEG or PNG. 1MB max.</p> */}
            {/* </div> */}

            <div>
              <input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />

              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                className="border-small mb-1"
                onPress={() => document.getElementById("profileImage")?.click()}
              >
                Change Photo
              </Button>

              {values.image instanceof File && (
                <p className="text-xs mt-1">{values.image.name}</p>
              )}

              {touched.image && errors.image && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.image as string}
                </p>
              )}

              <p className="text-xs mt-1">JPG, JPEG or PNG. 1MB max.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ name, label, type, isRequired }) => (
              <div key={name}>
                <Input
                  size="sm"
                  type={type}
                  name={name}
                  label={label}
                  labelPlacement="outside"
                  placeholder={label}
                  // Use type assertion to safely access values[name]
                  value={values[name as FormKey] as string}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue =
                      name === "phone"
                        ? formatPhoneNumber(e.target.value)
                        : e.target.value;
                    setFieldValue(name, newValue);
                  }}
                  onBlur={handleBlur}
                  isDisabled={name === "email" && fetchedUser?.email}
                  classNames={{ base: "data-disabled:opacity-70" }}
                  isRequired={isRequired}
                  errorMessage={errors[name as FormKey] as string}
                />
                {/* Use type assertion to safely access errors[name] and touched[name] */}
                {/* {touched[name as FormKey] && errors[name as FormKey] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[name as FormKey] as string}
                  </p>
                )} */}
              </div>
            ))}

            <div>
              <Select
                size="sm"
                name="medicalSpecialty"
                label="Medical Specialty"
                labelPlacement="outside"
                placeholder="Select a Medical Specialty"
                selectedKeys={new Set([values.medicalSpecialty])}
                disabledKeys={new Set([values.medicalSpecialty])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys).join("");
                  setFieldValue("medicalSpecialty", selected, true);
                }}
                isRequired={true}
              >
                {specialties?.map(
                  ({ title, _id }: { title: string; _id: string }) => (
                    <SelectItem key={_id}>{title}</SelectItem>
                  )
                )}
              </Select>

              {/* Use type assertion for errors.medicalSpecialty */}
              {touched.medicalSpecialty && errors.medicalSpecialty && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.medicalSpecialty as string}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <Button
              size="sm"
              type="submit"
              className="bg-foreground text-background"
              disabled={isDisabled}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
