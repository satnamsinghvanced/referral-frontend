import React from "react";
import { Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { categoryOptions, specialtyOptions } from "../../Utils/filters";
import Input from "../ui/Input";

interface PartnerNetworkForm {
  practiceName: string;
  category: string;
  primaryDoctor: string;
  yearEstablished: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  specialties: string[];
  notes: string;
}

const validationSchema = Yup.object().shape({
  practiceName: Yup.string().required("Practice Name is required"),
  category: Yup.string().required("Category is required"),
  primaryDoctor: Yup.string(),
  yearEstablished: Yup.string().matches(/^\d*$/, "Must be a number"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  website: Yup.string().url("Invalid URL"),
  specialties: Yup.array().of(Yup.string()),
  notes: Yup.string(),
});

const PartnerNetworkConfig: React.FC = () => {
  const formik = useFormik<PartnerNetworkForm>({
    initialValues: {
      practiceName: "",
      category: "",
      primaryDoctor: "",
      yearEstablished: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      specialties: [],
      notes: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
      {/* Basic Information */}
      <div className="space-y-4 border p-4 rounded-xl border-foreground/10">
        <h5 className="text-sm font-medium mb-3 text-foreground">
          Basic Information
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            size="sm"
            label="Practice Name"
            labelPlacement="outside-top"
            placeholder="Enter practice name"
            value={formik.values.practiceName}
            onChange={(value: string) =>
              formik.setFieldValue("practiceName", value)
            }
            formik={formik}
            variant="flat"
          />
          <Select
            size="sm"
            label="Category"
            labelPlacement="outside"
            placeholder="Select category"
            selectedKeys={
              formik.values.category ? [formik.values.category] : []
            }
            onChange={(e) => formik.setFieldValue("category", e.target.value)}
            onBlur={() => formik.setFieldTouched("category", true)}
            variant="flat"
          >
            {categoryOptions.map((category: any) => (
              <SelectItem key={category.value}>{category.label}</SelectItem>
            ))}
          </Select>

          <Input
            size="sm"
            label="Primary Doctor"
            labelPlacement="outside-top"
            placeholder="Enter primary doctor's name"
            value={formik.values.primaryDoctor}
            onChange={(value: string) =>
              formik.setFieldValue("primaryDoctor", value)
            }
            formik={formik}
            variant="flat"
          />
          <Input
            size="sm"
            label="Year Established"
            labelPlacement="outside-top"
            placeholder="e.g., 1998"
            type="number"
            value={formik.values.yearEstablished}
            onChange={(value: string) =>
              formik.setFieldValue("yearEstablished", value)
            }
            formik={formik}
            variant="flat"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 border p-4 rounded-xl border-foreground/10">
        <h5 className="text-sm font-medium mb-3 text-foreground">
          Contact Information
        </h5>
        <Input
          size="sm"
          label="Address"
          labelPlacement="outside-top"
          placeholder="Enter practice address"
          value={formik.values.address}
          onChange={(value: string) => formik.setFieldValue("address", value)}
          formik={formik}
          isRequired
          variant="flat"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            size="sm"
            label="Phone Number"
            labelPlacement="outside-top"
            placeholder="e.g., (123) 456-7890"
            value={formik.values.phone}
            onChange={(value: string) => formik.setFieldValue("phone", value)}
            onBlur={formik.handleBlur}
            variant="flat"
          />
          <Input
            size="sm"
            label="Email"
            labelPlacement="outside-top"
            placeholder="e.g. johndoe@gmail.com"
            type="email"
            value={formik.values.email}
            onChange={(value: string) => formik.setFieldValue("email", value)}
            formik={formik}
            isRequired
            variant="flat"
          />
        </div>
        <Input
          size="sm"
          label="Website"
          labelPlacement="outside-top"
          placeholder="e.g., www.practice.com"
          value={formik.values.website}
          onChange={(value: string) => formik.setFieldValue("website", value)}
          formik={formik}
          isRequired
          variant="flat"
        />
      </div>

      {/* Specialties */}
      <div className="space-y-4 border p-4 rounded-xl border-foreground/10">
        <h5 className="text-sm font-medium mb-3 text-foreground">
          Specialties
        </h5>
        <Select
          size="sm"
          variant="flat"
          selectionMode="multiple"
          placeholder="Select specialties"
          selectedKeys={formik.values.specialties}
          onSelectionChange={(keys) =>
            formik.setFieldValue("specialties", Array.from(keys))
          }
        >
          {specialtyOptions.map((specialty) => (
            <SelectItem key={specialty}>{specialty}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-4 border p-4 rounded-xl border-foreground/10">
        <h5 className="text-sm font-medium mb-3 text-foreground">Notes</h5>
        <Textarea
          size="sm"
          placeholder="Any additional notes about this practice..."
          value={formik.values.notes}
          onChange={(e) => formik.setFieldValue("notes", e.target.value)}
          onBlur={formik.handleBlur}
          variant="flat"
          minRows={3}
        />
      </div>
    </form>
  );
};

export default PartnerNetworkConfig;
