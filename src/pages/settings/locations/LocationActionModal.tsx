import React, { useEffect, useMemo } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tooltip,
} from "@heroui/react";
import { useFormik } from "formik";
import { FiPlus } from "react-icons/fi";
import * as Yup from "yup";
import { PHONE_REGEX, ZIP_CODE_REGEX } from "../../../consts/consts";
import {
  useCreateLocation,
  useFetchLocationDetails,
  useFetchLocations,
  useUpdateLocation,
} from "../../../hooks/settings/useLocation";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { LOCATION_COLORS } from "../../../providers/LocationContext";

interface LocationFormValues {
  name: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  color: string;
  isPrimary: boolean;
}

const LocationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Location name is required"),
  street: Yup.string().trim().required("Street is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  zipcode: Yup.string()
    .matches(ZIP_CODE_REGEX, "ZIP code must be exactly 5 digits")
    .required("ZIP code is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
  color: Yup.string().optional(),
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
  const { data: allLocationsData } = useFetchLocations({ limit: 100 });
  const { mutate: createLocation, isPending: isCreating } = useCreateLocation();
  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation();
  const isSaving = isCreating || isUpdating;

  const otherLocations = useMemo(() => {
    return (allLocationsData?.data || []).filter(
      (loc: any) => loc._id !== editLocationId
    );
  }, [allLocationsData, editLocationId]);

  const usedColorsMap = useMemo(() => {
    const map = new Map<string, string>();
    otherLocations.forEach((loc: any) => {
      if (loc.color) {
        map.set(loc.color.toLowerCase(), loc.name || "Another practice");
      }
    });
    return map;
  }, [otherLocations]);

  const defaultUnusedColor = useMemo(() => {
    const available = LOCATION_COLORS.find(
      (c) => !usedColorsMap.has(c.toLowerCase())
    );
    return available || LOCATION_COLORS[locationsCount % LOCATION_COLORS.length] || "#0ea5e9";
  }, [usedColorsMap, locationsCount]);

  const isOnlyLocation = !editLocationId ? locationsCount === 0 : locationsCount <= 1;

  const formik = useFormik<LocationFormValues>({
    initialValues: {
      name: location?.name || "",
      street: location?.address?.street || "",
      city: location?.address?.city || "",
      state: location?.address?.state || "",
      zipcode: location?.address?.zipcode || "",
      phone: formatPhoneNumber(location?.phone || ""),
      color: location?.color || defaultUnusedColor,
      isPrimary: editLocationId
        ? (location?.isPrimary ?? (isOnlyLocation ? true : false))
        : locationsCount === 0 ? true : false,
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
        color: values.color || "#0ea5e9",
        isPrimary: isOnlyLocation ? true : values.isPrimary,
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

  const selectedColor = formik.values.color?.toLowerCase()?.trim();
  const colorTakenBy = selectedColor ? usedColorsMap.get(selectedColor) : undefined;
  const isColorDuplicate = Boolean(colorTakenBy);

  const { resetForm } = formik;

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

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

            {/* Primary Color Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-foreground">
                Primary Color
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Custom Color Selector (First) */}
                <div className="flex items-center gap-2">
                  <label
                    className="w-8 h-8 rounded-lg cursor-pointer overflow-hidden relative shadow-xs transition-transform hover:scale-105 border border-foreground/10 shrink-0"
                    title="Pick custom color"
                  >
                    <input
                      type="color"
                      value={formik.values.color?.startsWith("#") ? formik.values.color : "#0ea5e9"}
                      onChange={(e) => formik.setFieldValue("color", e.target.value)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                    <div
                      className="w-full h-full rounded-lg"
                      style={{ backgroundColor: formik.values.color || "#0ea5e9" }}
                    />
                  </label>

                  <div className="flex items-center h-8 px-2.5 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-xs">
                    <input
                      type="text"
                      maxLength={7}
                      value={formik.values.color || ""}
                      placeholder="#0ea5e9"
                      onChange={(e) => {
                        let val = e.target.value.trim();
                        if (val && !val.startsWith("#")) {
                          val = `#${val}`;
                        }
                        formik.setFieldValue("color", val);
                      }}
                      className="bg-transparent text-zinc-100 outline-none w-20 font-mono text-xs font-medium placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Preset Color Swatches */}
                <div className="flex items-center gap-2">
                  {LOCATION_COLORS.map((c) => {
                    const isPicked =
                      formik.values.color?.toLowerCase() === c.toLowerCase();
                    const isUsedByOther = usedColorsMap.has(c.toLowerCase());
                    const usedByLocName = usedColorsMap.get(c.toLowerCase());

                    return (
                      <Tooltip
                        key={c}
                        content={isUsedByOther ? `Already used by "${usedByLocName}"` : c}
                        isDisabled={!isUsedByOther}
                      >
                        <button
                          key={c}
                          type="button"
                          onClick={() => formik.setFieldValue("color", c)}
                          className={`w-8 h-8 rounded-lg transition-all cursor-pointer shadow-xs shrink-0 relative ${
                            isPicked
                              ? "ring-2 ring-white scale-105 shadow-md"
                              : isUsedByOther
                              ? "opacity-40 hover:opacity-70"
                              : "hover:opacity-90 hover:scale-105 opacity-95"
                          }`}
                          style={{ backgroundColor: c }}
                          title={isUsedByOther ? `Used by ${usedByLocName}` : c}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
              {isColorDuplicate && (
                <p className="text-xs text-danger font-normal">
                  This color is already in use by &quot;{colorTakenBy}&quot;. Each practice location must have a unique color.
                </p>
              )}
            </div>

            {/* Primary Location Switch */}
            <div className="flex flex-col gap-1">
              <Switch
                size="sm"
                id="isPrimary"
                name="isPrimary"
                isDisabled={isOnlyLocation}
                isSelected={isOnlyLocation ? true : formik.values.isPrimary}
                onValueChange={(val: boolean) =>
                  formik.setFieldValue("isPrimary", isOnlyLocation ? true : val)
                }
              >
                Primary Location
              </Switch>
              {isOnlyLocation ? (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  This is the only location and is automatically set as primary.
                </p>
              ) : formik.values.isPrimary ? (
                <p className="text-[11px] text-primary dark:text-primary-400">
                  Setting this as primary will automatically switch primary status from the existing primary location.
                </p>
              ) : null}
            </div>

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
            isLoading={isSaving}
            startContent={!isSaving && <FiPlus className="size-[15px]" />}
            isDisabled={!formik.isValid || !formik.dirty || isSaving || isColorDuplicate}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationActionModal;
