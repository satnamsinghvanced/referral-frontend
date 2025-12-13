import React, { useImperativeHandle, forwardRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CampaignStepProps, CampaignData } from "./CampaignActionModal";
import clsx from "clsx";
import { Checkbox, Input, Select, SelectItem, Switch } from "@heroui/react";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

const SetupSchema = Yup.object().shape({
  name: Yup.string().required("Campaign Name is required"),
  subject: Yup.string().required("Email Subject Line is required"),
  type: Yup.string<CampaignData["type"]>().required(
    "Campaign Type is required"
  ),
  category: Yup.string<CampaignData["category"]>().required(
    "Category is required"
  ),
});

const CampaignSetupStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext }, ref) => {
  const formik = useFormik<CampaignData>({
    initialValues: data,
    validationSchema: SetupSchema,
    onSubmit: (values) => {
      onNext(values);
    },
    validateOnMount: true,
  });

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: () => {
      formik.handleSubmit();
    },
  }));

  const types: CampaignData["type"][] = [
    "One-time Email",
    "Automated Sequence",
  ];
  const categories: CampaignData["category"][] = [
    "Referral Outreach",
    "Patient Follow-up",
    "Practice Updates",
  ];

  const isError = (field: keyof CampaignData) =>
    !!(formik.touched[field] && formik.errors[field]);
  const getErrorMessage = (field: keyof CampaignData) =>
    formik.touched[field] ? formik.errors[field] : undefined;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-5">
      <h4 className="font-medium mb-4">Campaign Basics</h4>

      <Input
        size="sm"
        radius="sm"
        label="Campaign Name"
        labelPlacement="outside-top"
        placeholder="Enter campaign name..."
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={isError("name")}
        errorMessage={getErrorMessage("name")}
      />

      <Input
        size="sm"
        radius="sm"
        label="Email Subject Line"
        labelPlacement="outside-top"
        placeholder="Enter email subject..."
        name="subject"
        value={formik.values.subject}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={isError("subject")}
        errorMessage={getErrorMessage("subject")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          size="sm"
          radius="sm"
          label="Campaign Type"
          labelPlacement="outside"
          placeholder="Select Type"
          name="type"
          selectedKeys={[formik.values.type]}
          disabledKeys={[formik.values.type]}
          onSelectionChange={(keys) => {
            formik.setFieldValue("type", Array.from(keys)[0]);
            formik.setFieldTouched("type", true, false);
          }}
          isInvalid={isError("type")}
          errorMessage={getErrorMessage("type")}
          className="w-full"
        >
          {types.map((type) => (
            <SelectItem key={type}>{type}</SelectItem>
          ))}
        </Select>

        <Select
          size="sm"
          radius="sm"
          label="Category"
          labelPlacement="outside"
          placeholder="Select Category"
          name="category"
          selectedKeys={[formik.values.category]}
          disabledKeys={[formik.values.category]}
          onSelectionChange={(keys) => {
            formik.setFieldValue("category", Array.from(keys)[0]);
            formik.setFieldTouched("category", true, false);
          }}
          isInvalid={isError("category")}
          errorMessage={getErrorMessage("category")}
          className="w-full"
        >
          {categories.map((category) => (
            <SelectItem key={category}>{category}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Switch
          size="sm"
          isSelected={formik.values.abTesting}
          onValueChange={(isSelected: boolean) => {
            formik.setFieldValue("abTesting", isSelected);
          }}
        >
          Enable A/B Testing
        </Switch>
      </div>
    </form>
  );
};

export default forwardRef(CampaignSetupStep);
