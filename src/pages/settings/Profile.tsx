import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiCamera, FiTrash2, FiUpload, FiUser, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "../../consts/consts";
import { useFetchUser, useUpdateUser } from "../../hooks/settings/useUser";
import { useSpecialties } from "../../hooks/useCommon";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { updateUserFirstName } from "../../store/authSlice";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { useUpload } from "../../providers/UploadProvider";

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
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .matches(
      NAME_REGEX,
      "First name can only contain letters, spaces, hyphens, apostrophes, and full stops",
    )
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Multiple spaces are not allowed")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .matches(
      NAME_REGEX,
      "Last name can only contain letters, spaces, hyphens, apostrophes, and full stops",
    )
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Multiple spaces are not allowed")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: Yup.string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Invalid email format"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
  practiceName: Yup.string()
    .trim()
    .required("Practice name is required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Multiple spaces are not allowed"),
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
      },
    )
    .test("fileSize", "Image file is too large (max 10MB).", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 10485760;
    }) as Yup.Schema<File | string | undefined | null>,
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId || "";
  const { addManualUpload, updateManualUploadProgress, completeManualUpload } = useUpload();

  const { data: fetchedUser, isLoading } = useFetchUser(userId) as any;
  const { data: specialties } = useSpecialties();
  const { mutate: updateUser, isPending } = useUpdateUser(userId);

  const [previewUrl, setPreviewUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (fetchedUser?.image) {
      setPreviewUrl(
        `${fetchedUser.image.includes("http")
          ? ""
          : `${import.meta.env.VITE_IMAGE_URL}`
        }${fetchedUser.image}`,
      );
    } else if (fetchedUser) {
      setPreviewUrl("");
    }
  }, [fetchedUser]);

  useEffect(() => {
    setImageLoaded(false);
  }, [previewUrl]);

  const formik = useFormik<ProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      firstName: fetchedUser?.firstName || "",
      lastName: fetchedUser?.lastName || "",
      email: fetchedUser?.email || "",
      phone: fetchedUser?.phone ? formatPhoneNumber(fetchedUser.phone) : "",
      practiceName: fetchedUser?.practiceName || "",
      medicalSpecialty: (fetchedUser as any)?.medicalSpecialty || "",
      image: (fetchedUser as any)?.image,
    },
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      const imageFile = values.image;
      const isImageUpload = imageFile instanceof File;
      const uploadId = Math.random().toString(36).substring(7);
      const controller = new AbortController();

      if (isImageUpload) {
        addManualUpload(uploadId, imageFile.name, "image", controller);
      }

      const data = {
        firstName: values.firstName.trim().replace(/\s+/g, " "),
        lastName: values.lastName.trim().replace(/\s+/g, " "),
        email: values.email,
        phone: values.phone,
        practiceName: values.practiceName.trim().replace(/\s+/g, " "),
        medicalSpecialty: values.medicalSpecialty as any,
        image: values.image as any,
      };

      updateUser(
        {
          userData: data,
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            if (isImageUpload && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              updateManualUploadProgress(uploadId, percentCompleted);
            }
          },
          ...(isImageUpload && { uploadId }),
        },
        {
          onSuccess(data) {
            dispatch(updateUserFirstName({ firstName: data.firstName }));
          },
        },
      );
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
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      );
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", "");
    setPreviewUrl("");
    formik.setFieldTouched("image", true, true);
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
            <div className="relative size-20 group">
              <div
                className="size-full overflow-hidden rounded-full border border-foreground/10 bg-default-50 flex items-center justify-center relative cursor-pointer hover:opacity-95 transition-all shadow-sm"
                onClick={() => {
                  if (previewUrl) {
                    setIsImageModalOpen(true);
                  } else {
                    document.getElementById("profileImage")?.click();
                  }
                }}
                title={previewUrl ? "Click to view photo" : "Click to upload photo"}
              >
                {isLoading ? (
                  <Skeleton className="absolute inset-0 size-full" />
                ) : previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className={`size-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && (
                      <Skeleton className="absolute inset-0 size-full" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <FiCamera className="size-6 drop-shadow-md" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-default-400 group-hover:text-primary transition-colors">
                    <FiUser className="size-8" />
                  </div>
                )}
              </div>
              {previewUrl && !isLoading && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="solid"
                  color="danger"
                  radius="full"
                  className="absolute top-0 right-0 size-5 min-w-0 h-5 z-10 p-0 shadow-md border border-white dark:border-default-100"
                  onPress={handleRemoveImage}
                  title="Remove photo"
                >
                  <FiX className="size-3" />
                </Button>
              )}
            </div>
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
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {values.image.name}
                </p>
              )}

              {touched.image && errors.image && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.image as string}
                </p>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                JPG, JPEG or PNG. 10MB max.
              </p>
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
                selectedKeys={[values.medicalSpecialty]}
                disabledKeys={[values.medicalSpecialty]}
                onChange={handleChange}
                onBlur={handleBlur}
                isRequired={true}
                isInvalid={
                  !!(touched.medicalSpecialty && errors.medicalSpecialty)
                }
                errorMessage={
                  touched.medicalSpecialty &&
                  (errors.medicalSpecialty as string)
                }
              >
                {(specialties ?? []).map((item: any) => (
                  <SelectItem key={item._id} textValue={item.title}>
                    {item.title}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4">
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

      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        size="md"
        placement="center"
        classNames={{
          base: "bg-background border border-foreground/10 text-foreground rounded-2xl shadow-2xl overflow-hidden",
          closeButton: "top-4 right-4 text-foreground/60 hover:text-foreground hover:bg-default-100 transition-colors p-1.5 rounded-lg z-20",
        }}
      >
        <ModalContent className="p-4 sm:p-6 space-y-4">
          <ModalHeader className="p-0 border-b border-foreground/10 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Profile Photo
            </h3>
          </ModalHeader>

          <ModalBody className="p-0 flex flex-col items-center justify-center py-2">
            {previewUrl ? (
              <div className="relative size-64 sm:size-72 rounded-2xl overflow-hidden border border-foreground/10 shadow-lg bg-default-50 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Profile Large"
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <div className="size-48 rounded-full bg-default-100 flex items-center justify-center">
                <FiUser className="size-20 text-default-400" />
              </div>
            )}
          </ModalBody>

          <ModalFooter className="p-0 pt-2 flex items-center justify-between gap-2 border-t border-foreground/10">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="bg-red-50 text-red-600 border border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40 hover:!bg-red-600 hover:!text-white transition-all cursor-pointer font-medium shadow-sm"
                startContent={<FiTrash2 className="size-4" />}
                onPress={() => {
                  handleRemoveImage();
                  setIsImageModalOpen(false);
                }}
                isDisabled={!previewUrl}
              >
                Remove Photo
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="solid"
                className="font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                startContent={<FiUpload className="size-4" />}
                onPress={() => {
                  setIsImageModalOpen(false);
                  setTimeout(() => {
                    document.getElementById("profileImage")?.click();
                  }, 100);
                }}
              >
                Change Photo
              </Button>
            </div>
            <Button
              size="sm"
              variant="bordered"
              className="border-foreground/20 text-foreground hover:bg-default-100 dark:hover:bg-default-100 transition-all cursor-pointer font-medium"
              onPress={() => setIsImageModalOpen(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
