import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useFetchUser, useUpdateUser } from "../../hooks/settings/useUser";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useSpecialties } from "../../hooks/useCommon";

// --- Options (or you can keep the same) ---
// const specialties = [ ... ];

const fields = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "mobile", label: "Phone Number", type: "tel" },
  { name: "practiceName", label: "Practice Name", type: "text" },
];

// --- Yup Schema --- 
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required").max(50),
  lastName: Yup.string().required("Last name is required").max(50),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile: Yup.string().required("Phone number is required"),
  practiceName: Yup.string().required("Practice name is required"),
  medicalSpecialty: Yup.string().required("Specialty is required"),
  image: Yup.mixed()
    .nullable()
    .test("fileSize", "File size must be less than 1MB", (value) => {
      if (!value) return true;
      return (value as File).size <= 1024 * 1024;
    }),
});

const Profile = () => {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId || "";

  const { data: fetchedUser } = useFetchUser(userId);
  const { data: specialties } = useSpecialties();
  const { mutate: updateUser, isPending } = useUpdateUser(userId);

  const initialValues = {
    firstName: fetchedUser?.firstName || "Dr. Sarah",
    lastName: fetchedUser?.lastName || "Martinez",
    email: fetchedUser?.email || "sarah.martinez@tangeloortho.com",
    mobile: fetchedUser?.mobile || "+1 (918) 555-0100",
    practiceName: fetchedUser?.practiceName || "Tangelo Orthodontics",
    medicalSpecialty: fetchedUser?.medicalSpecialty,
    image: fetchedUser?.image || null,
  };

  const [previewUrl, setPreviewUrl] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  );

  useEffect(() => {
    setPreviewUrl(import.meta.env.VITE_IMAGE_URL + fetchedUser?.image);
  }, [fetchedUser]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("image", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    // Prepare data directly without FormData
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      practiceName: values.practiceName,
      medicalSpecialty: values.medicalSpecialty,
      image: values.image || undefined, // Only append image if it's present
    };

    // Call the mutation with the prepared data
    updateUser(data);
  };

  return (
    <div className="p-4 bg-background border border-foreground/10 rounded-lg">
      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <h4 className="flex gap-2 items-center mb-4">
              <FiUser className="w-4 h-4" />
              <span className="text-sm !font-extralight">
                Profile Information
              </span>
            </h4>

            {/* Avatar Upload */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={previewUrl}
                alt="Profile"
                className="rounded-full w-20 h-20 object-cover"
              />
              <div>
                <Input
                  size="sm"
                  type="file"
                  accept="image/*"
                  className="w-fit shadow-none"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  variant="bordered"
                />
                {errors.image && touched.image && (
                  <p className="text-xs text-red-500">{errors.image as String}</p>
                )}
                <p className="text-xs mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(({ name, label, type }) => (
                <div key={name}>
                  <Field
                    as={Input}
                    size="sm"
                    type={type}
                    name={name}
                    label={label}
                    labelPlacement="outside"
                    placeholder={label}
                    value={values[name as keyof typeof values]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue(name, e.target.value)
                    }
                  />
                  {errors[name as keyof typeof errors] &&
                    touched[name as keyof typeof touched] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[name as keyof typeof errors] as string}
                      </p>
                    )}
                </div>
              ))}

              {/* Specialty */}
              <div>
                <Select
                  size="sm"
                  name="medicalSpecialty"
                  label="Medical Specialty"
                  labelPlacement="outside"
                  placeholder="Select a Medical Specialty"
                  selectedKeys={[values.medicalSpecialty]}
                  onSelectionChange={(keys) =>
                    setFieldValue("medicalSpecialty", Array.from(keys)[0])
                  }
                >
                  {specialties?.map(
                    ({ title, _id }: { title: string; _id: string }) => (
                      <SelectItem key={_id} textValue={title}>
                        {title}
                      </SelectItem>
                    )
                  )}
                </Select>
                {errors.medicalSpecialty && touched.medicalSpecialty && (
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
                disabled={isPending} // Disable button while submitting
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile;
