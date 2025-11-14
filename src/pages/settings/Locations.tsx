import { Button, Card, CardBody, CardHeader, Switch } from "@heroui/react";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import ActionModal from "../../components/common/ActionModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import {
  useCreateLocation,
  useDeleteLocation,
  useFetchLocationDetails,
  useFetchLocations,
  useUpdateLocation,
} from "../../hooks/settings/useLocation";
import { Location } from "../../services/settings/location";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import LocationSkeleton from "../../components/skeletons/LocationSkeleton";
import EmptyState from "../../components/common/EmptyState";
import { PHONE_REGEX } from "../../consts/consts";

export interface LocationFormValues {
  name: string;
  street: string;
  city: string;
  state: string;
  zipcode: number;
  phone: string;
  isPrimary: boolean;
}

const LocationSchema = Yup.object().shape({
  name: Yup.string().required("Location name is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.number()
    .typeError("ZIP must be a number")
    .integer("ZIP must be a whole number")
    .min(10000, "ZIP code must be 5 digits (e.g., 10000)")
    .max(99999, "ZIP code must be 5 digits (e.g., 99999)"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
  isPrimary: Yup.boolean(),
});

const fieldConfig = [
  {
    name: "name",
    type: "text",
    label: "Location Name",
    placeholder: "Enter location name",
  },
  {
    name: "street",
    type: "text",
    label: "Street",
    placeholder: "Enter street",
  },
  { name: "city", type: "text", label: "City", placeholder: "Enter city" },
  { name: "state", type: "text", label: "State", placeholder: "Enter state" },
  {
    name: "zipcode",
    type: "number",
    label: "Zipcode",
    placeholder: "Enter zipcode",
  },
  {
    name: "phone",
    type: "tel",
    label: "Phone",
    placeholder: "Enter phone number",
  },
];

const Locations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editLocationId, setEditLocationId] = useState<string>("");
  const [deleteLocationId, setDeleteLocationId] = useState<string>("");

  const { data: locations, isLoading: locationsIsLoading } =
    useFetchLocations();
  const { data: location } = useFetchLocationDetails(editLocationId);
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: updateLocation } = useUpdateLocation();
  const { mutate: deleteLocation } = useDeleteLocation();

  const formik = useFormik<LocationFormValues>({
    initialValues: {
      name: location?.name || "",
      street: location?.address?.street || "",
      city: location?.address?.city || "",
      state: location?.address?.state || "",
      zipcode: location?.address?.zipcode || null,
      phone: location?.phone || "",
      isPrimary: location?.isPrimary || false,
    },
    enableReinitialize: !!location,
    validationSchema: LocationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload = {
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipcode: values.zipcode,
        },
        name: values.name,
        phone: values.phone,
        isPrimary: values.isPrimary,
      };

      if (editLocationId) {
        // @ts-ignore
        updateLocation(
          { id: editLocationId, data: payload },
          {
            onSuccess: () => setIsModalOpen(false),
          }
        );
      } else {
        createLocation(payload, {
          onSuccess: () => setIsModalOpen(false),
        });
      }
    },
  });

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditLocationId("");
    setDeleteLocationId("");
    formik.resetForm();
  };

  const handleEdit = (id: string) => {
    setEditLocationId(id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteLocationId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteLocationId) return;
    deleteLocation(deleteLocationId, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  return (
    <>
      <Card className="rounded-xl shadow-none border border-foreground/10">
        <CardHeader className="flex items-center gap-3 px-5 pt-5 pb-0">
          <GrLocation className="h-5 w-5" />
          <p className="text-base">Practice Locations</p>
        </CardHeader>

        <CardBody className="p-5 space-y-3">
          {locationsIsLoading && <LocationSkeleton count={3} />}

          {!locationsIsLoading && (!locations || locations.length === 0) && (
            <EmptyState
              icon={<GrLocation className="h-6 w-6" />}
              title="No Practice Locations Found"
              message="Add your first practice location to get started."
            />
          )}
          {/* Location List */}
          {!locationsIsLoading &&
            locations &&
            locations?.length > 0 &&
            locations?.map((loc: Location) => (
              <div
                key={loc._id}
                className="p-3 border border-foreground/10 rounded-lg flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{loc.name}</h4>
                    {loc.isPrimary && (
                      <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 bg-blue-100 text-blue-800">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {`${loc.address.street}, ${loc.address.city}, ${loc.address.state}, ${loc.address.zipcode}`}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {loc.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    className="border-foreground/10 border-small"
                    // @ts-ignore
                    onPress={() => handleEdit(loc._id)}
                  >
                    <BiEdit className="size-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    className="border-foreground/10 text-red-600 border-small"
                    // @ts-ignore
                    onPress={() => handleDeleteClick(loc._id)}
                  >
                    <RiDeleteBinLine className="size-4" />
                  </Button>
                </div>
              </div>
            ))}

          {/* Add Location */}
          {!locationsIsLoading && (
            <Button
              variant="bordered"
              size="sm"
              className="w-full flex items-center justify-center gap-2 border-foreground/10 border-small font-medium"
              onPress={() => {
                setIsModalOpen(true);
                setEditLocationId("");
                formik.resetForm();
              }}
            >
              <FiPlus className="h-4 w-4" />
              Add Location
            </Button>
          )}
        </CardBody>
      </Card>

      {/* ✅ Add / Edit Modal */}
      <ActionModal
        isOpen={isModalOpen}
        heading={
          editLocationId
            ? "Edit Practice Location"
            : "Add New Practice Location"
        }
        description="Complete all required fields to add or edit a practice location."
        onClose={handleCancel}
        buttons={[
          {
            text: "Cancel",
            onPress: handleCancel,
            variant: "light",
            color: "default",
            className: "border border-foreground/10",
          },
          {
            text: "Save",
            onPress: formik.handleSubmit,
            color: "default",
            className: "bg-foreground text-background",
            icon: <FiPlus className="size-4" />,
            isDisabled: !formik.isValid || !formik.dirty,
          },
        ]}
      >
        <form
          id="location-form"
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4"
        >
          {fieldConfig.map((field) => (
            <Input
              key={field.name}
              id={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              labelPlacement="outside"
              placeholder={field.placeholder}
              value={
                formik.values[field.name as keyof LocationFormValues] as string
              }
              onChange={(val: string) => {
                const newValue =
                  field.name === "phone" ? formatPhoneNumber(val) : val;
                formik.setFieldValue(field.name, newValue);
              }}
              // FIX: Ensure all fields, including phone, have onBlur, error, and touched
              onBlur={formik.handleBlur}
              error={
                formik.errors[field.name as keyof LocationFormValues] as string
              }
              touched={
                formik.touched[
                  field.name as keyof LocationFormValues
                ] as boolean
              }
              isRequired
            />
          ))}

          <Switch
            size="sm"
            id="isPrimary"
            name="isPrimary"
            isSelected={formik.values.isPrimary}
            onValueChange={(val: boolean) =>
              formik.setFieldValue("isPrimary", val)
            }
          >
            Primary Location
          </Switch>
        </form>
      </ActionModal>

      {/* ✅ Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        heading="Delete Practice Location"
        description="Are you sure you want to delete this practice location? This action cannot be undone."
        onClose={handleCancel}
        buttons={[
          {
            text: "Cancel",
            onPress: handleCancel,
            variant: "light",
            color: "default",
            className: "border border-foreground/10",
          },
          {
            text: "Delete",
            onPress: handleDeleteConfirm,
            color: "danger",
            className: "bg-red-700 text-background",
            icon: <RiDeleteBinLine className="size-4" />,
          },
        ]}
      />
    </>
  );
};

export default Locations;
