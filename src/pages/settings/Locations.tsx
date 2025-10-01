import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import AddModal from "../../components/common/AddModal";

interface Location {
  name: string;
  address: string;
  phone: string;
  isPrimary?: boolean;
}
import { Switch } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import {
  useCreateLocation,
  useFetchLocations,
} from "../../hooks/settings/useLocation";

export interface LocationFormValues {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  phone: string;
  isPrimary: boolean;
}

// ✅ Validation schema
const LocationSchema = Yup.object().shape({
  name: Yup.string().required("Location name is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.string()
    .matches(/^\d{5}$/, "Must be a valid 5-digit zip")
    .required("Zipcode is required"),
  phone: Yup.string()
    .matches(/^[0-9()+-\s]*$/, "Invalid phone number")
    .required("Phone is required"),
  isPrimary: Yup.boolean(),
});

// ✅ Input config
const fieldConfig = [
  { name: "name", label: "Location Name", placeholder: "Enter location name" },
  { name: "street", label: "Street", placeholder: "Enter street" },
  { name: "city", label: "City", placeholder: "Enter city" },
  { name: "state", label: "State", placeholder: "Enter state" },
  { name: "zipcode", label: "Zipcode", placeholder: "Enter zipcode" },
  { name: "phone", label: "Phone", placeholder: "Enter phone number" },
];

interface AddLocationModalContentProps {
  editedLocationData: LocationFormValues | null;
}

const AddLocationModalContent: React.FC<AddLocationModalContentProps> = ({
  editedLocationData,
}) => {
  const { mutate: createLocation } = useCreateLocation();

  const formik = useFormik<LocationFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipcode: "",
      },
      phone: "",
      isPrimary: false,
    },
    validationSchema: LocationSchema,
    onSubmit: (values) => {
      // createLocation(values);
      console.log("Form submitted:", values);
    },
  });

  return (
    <form
      id="location-form"
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4"
    >
      {fieldConfig.map((field) => (
        <Input
          key={field.name}
          id={field.name}
          name={field.name}
          label={field.label}
          labelPlacement="outside"
          placeholder={field.placeholder}
          value={formik.getFieldProps(field.name).value}
          formik={formik}
          // onBlur={formik.handleBlur}
          // isInvalid={
          //   !!formik.errors[field.name as keyof typeof formik.errors]
          // }
          // errorMessage={
          //   formik.touched[field.name as keyof typeof formik.touched] &&
          //   formik.errors[field.name as keyof typeof formik.errors]
          //     ? String(formik.errors[field.name as keyof typeof formik.errors])
          //     : ""
          // }
        />
      ))}

      {/* Switch for Primary Location */}
      <div className="flex items-center gap-3">
        <Switch
          size="sm"
          id="isPrimary"
          name="isPrimary"
          isSelected={formik.values.isPrimary}
          onValueChange={(val) => formik.setFieldValue("isPrimary", val)}
        >
          Primary Location
        </Switch>
      </div>
    </form>
  );
};

const Locations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: locations, isLoading } = useFetchLocations();

  const cancelBtnData = {
    function: () => {
      setIsModalOpen(false);
      setIsDeleteModalOpen(false);
    },
    style: "border-foreground/10  border text-foreground hover:bg-background",
    text: "cancel",
  };

  const addBtnData = {
    function: () => {},
    style: "bg-foreground text-background",
    text: "add",
  };

  const handleEdit = (name: string) => {
    console.log("Edit", name);
  };

  const handleDelete = (name: string) => {
    setIsDeleteModalOpen(true);
    console.log("Delete", name);
  };

  return (
    <>
      <Card className="rounded-xl shadow-none border border-foreground/10">
        <CardHeader className="flex items-center gap-3 px-5 pt-5 pb-0">
          <GrLocation className="h-5 w-5" />
          <p className="text-base">Practice Locations</p>
        </CardHeader>

        <CardBody className="p-5 space-y-3">
          {/* Location List */}
          {locations?.map((location, index) => (
            <div
              key={index}
              className="p-3 border border-foreground/10 rounded-lg flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm">{location.name}</h4>
                  {location.isPrimary && (
                    <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 bg-blue-100 text-blue-800">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {`${location.address.street}, ${location.address.city}, ${location.address.state}, ${location.address.zipcode}`}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {location.phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  className="border-foreground/10 border-small"
                  onPress={() => handleEdit(location.name)}
                >
                  <BiEdit className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  className="border-foreground/10 text-red-600 border-small"
                  onPress={() => handleDelete(location.name)}
                >
                  <RiDeleteBinLine className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add Location */}
          <Button
            variant="bordered"
            size="sm"
            className="w-full flex items-center justify-center gap-2 border-foreground/10 border-small font-medium"
            onPress={() => setIsModalOpen(true)}
          >
            <FiPlus className="h-4 w-4" />
            Add Location
          </Button>
        </CardBody>
      </Card>
      <AddModal
        isOpen={isModalOpen}
        heading="Add New Practice Location"
        description="Add a new doctor practice location to your system. Complete all required fields to add new practice location."
        cancelBtnData={cancelBtnData}
        addBtnData={addBtnData}
        config={<AddLocationModalContent editedLocationData={null} />}
      />
      <AddModal
        isOpen={isDeleteModalOpen}
        heading="Delete Practice Location"
        description="Are you sure you want to delete this practice location? This action can't be undone."
        cancelBtnData={cancelBtnData}
        addBtnData={{
          function: () => {},
          style: "bg-red-700 text-background",
          text: "Delete",
        }}
      />
    </>
  );
};

export default Locations;
