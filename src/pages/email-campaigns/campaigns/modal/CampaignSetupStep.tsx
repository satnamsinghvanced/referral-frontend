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
  subjectLine: Yup.string().required("Email Subject Line is required"),
  type: Yup.string().required("Campaign Type is required"),
  category: Yup.string().required("Category is required"),
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
    enableReinitialize: true,
  });

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: () => {
      formik.handleSubmit();
    },
  }));

  const types = [
    { value: "oneTimeEmail", label: "One-time Email" },
    { value: "newsletter", label: "Newsletter" },
  ];
  const categories = [
    { value: "referralOutreach", label: "Referral Outreach" },
    { value: "newsletters", label: "Newsletters" },
  ];

  const isError = (field: keyof CampaignData) =>
    !!(formik.touched[field] && formik.errors[field]);
  const getErrorMessage = (field: keyof CampaignData) =>
    formik.touched[field] ? (formik.errors[field] as string) : undefined;

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
        name="subjectLine"
        value={formik.values.subjectLine}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={isError("subjectLine")}
        errorMessage={getErrorMessage("subjectLine")}
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
            <SelectItem key={type.value}>{type.label}</SelectItem>
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
            <SelectItem key={category.value}>{category.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Switch
          size="sm"
          isSelected={formik.values.isABTesting}
          onValueChange={(isSelected: boolean) => {
            formik.setFieldValue("isABTesting", isSelected);
          }}
        >
          Enable A/B Testing
        </Switch>
      </div>
    </form>
  );
};

export default forwardRef(CampaignSetupStep);
