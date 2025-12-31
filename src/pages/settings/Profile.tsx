import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { EMAIL_REGEX, PHONE_REGEX } from "../../consts/consts";
import { useFetchUser, useUpdateUser } from "../../hooks/settings/useUser";
import { useSpecialties } from "../../hooks/useCommon";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { updateUserFirstName } from "../../store/authSlice";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceName: string;
  medicalSpecialty: string;
  image: File | string | undefined;
}

const fields = [
  { name: "firstName", label: "First Name", type: "text", isRequired: true },
  { name: "lastName", label: "Last Name", type: "text", isRequired: true },
  { name: "email", label: "Email Address", type: "email", isRequired: true },
  { name: "phone", label: "Phone Number", type: "tel", isRequired: true },
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
  image: Yup.mixed<File | string>()
    .nullable()
    .test(
      "fileType",
      "Only JPG, JPEG, or PNG formats are accepted.",
      (value) => {
        if (!value) return true;
        if (typeof value === "string") return true;
        const supportedFormats = ["image/jpeg", "image/png"];
        return supportedFormats.includes(value.type);
      }
    )
    .test("fileSize", "Image file is too large (max 1MB).", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 1048576;
    }) as Yup.Schema<File | string | undefined | null>,
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
            : `${import.meta.env.VITE_IMAGE_URL}`
        }${fetchedUser.image}`
      );
    }
  }, [fetchedUser]);

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
        },
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true, false);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
      );
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    formik.setFieldValue("phone", formattedValue);
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
    handleChange,
    setFieldTouched,
  } = formik;

  return (
    <>
      <div className="p-4 bg-background border border-foreground/10 rounded-xl">
        <form onSubmit={handleSubmit}>
          <h4 className="flex gap-2 items-center mb-4">
            <FiUser className="size-5" />
            <span>Profile Information</span>
          </h4>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={previewUrl}
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover"
            />
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
            {fields.map(({ name, label, type, isRequired }) => {
              const key = name as keyof ProfileFormValues;
              const isPhone = name === "phone";

              return (
                <div key={name}>
                  <Input
                    size="sm"
                    type={type}
                    name={name}
                    label={label}
                    labelPlacement="outside"
                    placeholder={label}
                    value={(values[key] as string) || ""}
                    onChange={isPhone ? handlePhoneChange : handleChange}
                    onBlur={handleBlur}
                    isDisabled={name === "email" && !!fetchedUser?.email}
                    classNames={{ base: "data-disabled:opacity-70" }}
                    isRequired={isRequired}
                    isInvalid={!!(touched[key] && errors[key])}
                    errorMessage={errors[key] as string}
                  />
                </div>
              );
            })}

            <div className="relative flex">
              <Select
                size="sm"
                name="medicalSpecialty"
                label="Medical Specialty"
                labelPlacement="outside"
                placeholder="Select a Medical Specialty"
                selectedKeys={new Set([values.medicalSpecialty])}
                onChange={handleChange}
                onBlur={handleBlur}
                isRequired={true}
                isInvalid={
                  !!(touched.medicalSpecialty && errors.medicalSpecialty)
                }
                errorMessage={errors.medicalSpecialty as string}
              >
                {(specialties ?? []).map((item: any) => (
                  <SelectItem key={item._id} textValue={item.title}>
                    {item.title}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-5">
            <Button
              size="sm"
              type="submit"
              variant="solid"
              color="primary"
              isDisabled={!formik.isValid || !formik.dirty || isPending}
              isLoading={isPending}
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
