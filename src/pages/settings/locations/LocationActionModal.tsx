import React, { useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@heroui/react";
import { useFormik } from "formik";
import { FiPlus } from "react-icons/fi";
import * as Yup from "yup";
import { PHONE_REGEX, ZIP_CODE_REGEX } from "../../../consts/consts";
import {
  useCreateLocation,
  useFetchLocationDetails,
  useUpdateLocation,
} from "../../../hooks/settings/useLocation";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

interface LocationFormValues {
  name: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  isPrimary: boolean;
}

const LocationSchema = Yup.object().shape({
  name: Yup.string().required("Location name is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.string()
    .matches(ZIP_CODE_REGEX, "ZIP code must be exactly 5 digits")
    .required("ZIP code is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
  isPrimary: Yup.boolean(),
});

const FORM_FIELDS = [
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
    type: "text",
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

interface LocationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editLocationId: string;
  locationsCount: number;
}

const LocationActionModal = ({
  isOpen,
  onClose,
  editLocationId,
  locationsCount,
}: LocationActionModalProps) => {
  const { data: location } = useFetchLocationDetails(editLocationId);
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: updateLocation } = useUpdateLocation();

  const formik = useFormik<LocationFormValues>({
    initialValues: {
      name: location?.name || "",
      street: location?.address?.street || "",
      city: location?.address?.city || "",
      state: location?.address?.state || "",
      zipcode: location?.address?.zipcode || "",
      phone: location?.phone || "",
      isPrimary: location?.isPrimary || locationsCount === 0 ? true : false,
    },
    enableReinitialize: !!location || !editLocationId,
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
        updateLocation(
          { id: editLocationId, data: payload },
          {
            onSuccess: () => {
              onClose();
              formik.resetForm();
            },
          },
        );
      } else {
        createLocation(payload, {
          onSuccess: () => {
            onClose();
            formik.resetForm();
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-4">
          <h4 className="text-base font-medium">
            {editLocationId
              ? "Edit Practice Location"
              : "Add New Practice Location"}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            Complete all required fields to add or edit a practice location.
          </p>
        </ModalHeader>
        <ModalBody className="px-4 py-0">
          <form
            id="location-form"
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4"
          >
            {FORM_FIELDS.map((field) => (
              <React.Fragment key={field.name}>
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  labelPlacement="outside"
                  placeholder={field.placeholder}
                  size="sm"
                  radius="sm"
                  variant="flat"
                  value={
                    formik.values[
                      field.name as keyof LocationFormValues
                    ] as string
                  }
                  onValueChange={(val: string) => {
                    let newValue = val;
                    if (field.name === "phone") {
                      newValue = formatPhoneNumber(val);
                    } else if (field.name === "zipcode") {
                      newValue = val.replace(/\D/g, "").slice(0, 5);
                    }
                    formik.setFieldValue(field.name, newValue);
                  }}
                  onBlur={formik.handleBlur}
                  {...(field.name === "zipcode" ? { maxLength: 5 } : {})}
                  {...(field.name === "phone" ? { maxLength: 14 } : {})}
                  isInvalid={
                    !!(
                      formik.touched[field.name as keyof LocationFormValues] &&
                      formik.errors[field.name as keyof LocationFormValues]
                    )
                  }
                  errorMessage={
                    formik.touched[field.name as keyof LocationFormValues] &&
                    (formik.errors[
                      field.name as keyof LocationFormValues
                    ] as string)
                  }
                  isRequired
                />
              </React.Fragment>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Note: Please ensure the address is accurate as it will be verified
              with Google Maps.
            </p>
          </form>
        </ModalBody>
        <ModalFooter className="p-4">
          <Button
            onPress={handleClose}
            variant="ghost"
            color="default"
            size="sm"
            radius="sm"
            className="border-small"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="location-form"
            variant="solid"
            color="primary"
            size="sm"
            radius="sm"
            startContent={<FiPlus className="size-[15px]" />}
            isDisabled={!formik.isValid || !formik.dirty}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationActionModal;
