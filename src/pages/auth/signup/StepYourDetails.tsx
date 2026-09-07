import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { FiUser, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { StepYourDetailsProps, MEDICAL_SPECIALTIES } from "./types";

export const StepYourDetails: React.FC<StepYourDetailsProps> = ({ formik }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-2xl">
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
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="e.g. John"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 rounded-xl",
                  }}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.firstName}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="e.g. Smith"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 rounded-xl",
                  }}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.lastName}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="developer@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.email && formik.errors.email)}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 rounded-xl",
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.email}</span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="mobile"
                  maxLength={10}
                  placeholder="(555) 000-0000"
                  value={formik.values.mobile}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                    formik.setFieldValue("mobile", clean);
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.mobile && formik.errors.mobile)}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 rounded-xl",
                  }}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.mobile}</span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Practice Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="practiceName"
                  placeholder="Smith Orthodontics"
                  value={formik.values.practiceName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.practiceName && formik.errors.practiceName)}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 rounded-xl",
                  }}
                />
                {formik.touched.practiceName && formik.errors.practiceName && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.practiceName}</span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <Select
                  selectedKeys={formik.values.medicalSpecialty ? [formik.values.medicalSpecialty] : []}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    formik.setFieldValue("medicalSpecialty", val);
                  }}
                  placeholder="Select your specialty"
                  variant="bordered"
                  aria-label="Select Specialty"
                  isInvalid={!!(formik.touched.medicalSpecialty && formik.errors.medicalSpecialty)}
                  classNames={{
                    trigger: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 min-h-11 rounded-xl",
                  }}
                >
                  {MEDICAL_SPECIALTIES.map((sp) => (
                    <SelectItem key={sp.key} textValue={sp.label}>
                      {sp.label}
                    </SelectItem>
                  ))}
                </Select>
                {formik.touched.medicalSpecialty && formik.errors.medicalSpecialty && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.medicalSpecialty}</span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.password && formik.errors.password)}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  }
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-transparent h-11 rounded-xl",
                  }}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Min. 8 chars, must have Uppercase, Lowercase, Number & Special Character
                </span>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-danger text-xs mt-1 block font-medium">{formik.errors.password}</span>
                )}
              </div>
            </div>

            <div className="pt-3">
              <Checkbox
                isSelected={formik.values.messageAlert}
                onValueChange={(val) => formik.setFieldValue("messageAlert", val)}
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
