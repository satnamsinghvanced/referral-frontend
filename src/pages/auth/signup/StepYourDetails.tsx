import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { FiUser, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { StepYourDetailsProps } from "./types";
import { fetchSpecialtiesList } from "../../../services/specialty";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  colSpan?: string;
  maxLength?: number;
  isSelect?: boolean;
  isPassword?: boolean;
  helpText?: string;
}

const FORM_FIELDS: FieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "e.g. John",
    required: true,
    colSpan: "col-span-1",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "e.g. Smith",
    required: true,
    colSpan: "col-span-1",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "developer@example.com",
    required: true,
    colSpan: "md:col-span-2",
  },
  {
    name: "mobile",
    label: "Phone Number",
    type: "tel",
    placeholder: "(555) 000-0000",
    required: true,
    maxLength: 10,
    colSpan: "md:col-span-2",
  },
  {
    name: "practiceName",
    label: "Practice Name",
    type: "text",
    placeholder: "Smith Orthodontics",
    required: true,
    colSpan: "md:col-span-2",
  },
  {
    name: "medicalSpecialty",
    label: "Specialty",
    type: "select",
    placeholder: "Select your specialty",
    required: true,
    isSelect: true,
    colSpan: "md:col-span-2",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••••••••••••••",
    required: true,
    isPassword: true,
    helpText: "Min. 8 chars, must have Uppercase, Lowercase, Number & Special Character",
    colSpan: "md:col-span-2",
  },
];

export const StepYourDetails: React.FC<StepYourDetailsProps> = ({ formik }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [specialtiesList, setSpecialtiesList] = useState<{ key: string; label: string }[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        const data = await fetchSpecialtiesList();
        if (Array.isArray(data)) {
          const activeOnly = data.filter((s: any) => s.status !== "inactive");
          setSpecialtiesList(
            activeOnly.map((s: any) => ({
              key: s._id || s.title || s.name,
              label: s.title || s.name,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch specialties for signup:", err);
      } finally {
        setLoadingSpecialties(false);
      }
    };
    loadSpecialties();
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl">
        <CardBody className="p-6 sm:p-10">
          <div className="flex items-center gap-2.5 mb-6 text-slate-900 dark:text-white font-extrabold text-xl">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center">
              <FiUser className="w-5 h-5" />
            </div>
            <h2>Your Information</h2>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORM_FIELDS.map((field) => {
                const isTouched = formik.touched[field.name];
                const error = formik.errors[field.name];
                const value = formik.values[field.name];
                const isInvalid = !!(isTouched && error);
                return (
                  <div key={field.name} className={field.colSpan || "col-span-1"}>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.isSelect ? (
                      <Select
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const val = Array.from(keys)[0] as string;
                          formik.setFieldValue(field.name, val);
                        }}
                        placeholder={loadingSpecialties ? "Loading specialties..." : "Select your specialty"}
                        isLoading={loadingSpecialties}
                        variant="bordered"
                        aria-label={field.label}
                        isInvalid={isInvalid}
                        classNames={{
                          trigger: `border ${value
                            ? "border-[#20a9f8]"
                            : "border-slate-300 dark:border-slate-700 group-data-[hover=true]:border-slate-400 hover:border-slate-400"
                            } bg-[#f8fafc] dark:bg-slate-900/50 h-11 min-h-11 rounded-xl transition-colors group-data-[focus=true]:!border-[#20a9f8] group-data-[open=true]:!border-[#20a9f8]`,
                          value: "text-slate-900 dark:text-slate-100 font-medium text-sm",
                        }}
                      >
                        {specialtiesList.map((sp) => (
                          <SelectItem key={sp.key} textValue={sp.label}>
                            {sp.label}
                          </SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        type={field.isPassword ? (showPassword ? "text" : "password") : field.type}
                        name={field.name}
                        {...(field.maxLength ? { maxLength: field.maxLength } : {})}
                        placeholder={field.placeholder}
                        variant="bordered"
                        value={value}
                        onChange={(e) => {
                          if (field.name === "mobile") {
                            const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                            formik.setFieldValue("mobile", clean);
                          } else {
                            formik.handleChange(e);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={isInvalid}
                        endContent={
                          field.isPassword ? (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                          ) : undefined
                        }
                        classNames={{
                          inputWrapper: `border ${value
                            ? "border-[#20a9f8]"
                            : "border-slate-300 dark:border-slate-700 group-data-[hover=true]:border-slate-400 hover:border-slate-400"
                            } bg-[#f8fafc] dark:bg-slate-900/50 h-11 rounded-xl transition-colors group-data-[focus=true]:!border-[#20a9f8] focus-within:!border-[#20a9f8]`,
                          input: "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium text-sm",
                        }}
                      />
                    )}
                    {field.helpText && (
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {field.helpText}
                      </span>
                    )}
                    {isInvalid && (
                      <span className="text-danger text-xs mt-1 block font-medium">{error as string}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="pt-3">
              <Checkbox
                color="primary"
                isSelected={formik.values.messageAlert}
                onValueChange={(val) => {
                  formik.setFieldValue("messageAlert", val);
                  formik.setFieldTouched("messageAlert", true, false);
                }}
                isInvalid={!!(formik.touched.messageAlert && formik.errors.messageAlert)}
                classNames={{
                  label: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
                }}
              >
                Yes, text me account alerts from PracticeROI at the mobile number above. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe, HELP for help. See our Privacy Policy and Terms of Service.
              </Checkbox>
            </div>
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold h-11 rounded-xl px-10 text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Payment</span>
                <FiArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center pt-4">
              <span className="text-xs text-slate-500">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-xs font-bold text-sky-500 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

