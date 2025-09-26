import React, { useState, ReactNode } from "react";
import { Input as HeroInput } from "@heroui/react"; // Adjust import based on actual Hero UI package
import { IoMdMail } from "react-icons/io";
import { FaLock, FaEyeSlash } from "react-icons/fa";
import { TbEyeFilled } from "react-icons/tb";

interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value: any;
  className?: string;
  formik?: any; // Or better, use FormikProps from formik package
  startContent?: ReactNode;
  endContent?: ReactNode;
  [key: string]: any; // For any additional props to pass to Input
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder = "",
  type = "text",
  value,
  className,
  formik,
  startContent,
  endContent,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Toggle password visibility helper
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Determine actual input type, especially for password
  const inputType =
    type === "password" ? (passwordVisible ? "text" : "password") : type;

  // Compose startContent and endContent depending on type
  const renderStartContent = () => {
    if (startContent) return startContent;

    switch (type) {
      case "email":
        return (
          <IoMdMail className="text-default-400 pointer-events-none flex-shrink-0" />
        );
      case "password":
        return (
          <FaLock className="text-default-400 pointer-events-none flex-shrink-0" />
        );
      default:
        return null;
    }
  };

  const renderEndContent = () => {
    if (endContent) return endContent;

    if (type === "password") {
      return (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="cursor-pointer focus:outline-none"
          aria-label={passwordVisible ? "Hide password" : "Show password"}
        >
          {passwordVisible ? (
            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <TbEyeFilled className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      );
    }

    return null;
  };

  // Helper functions for form validation states
  const getFieldError = (name: string) => {
    return formik.touched[name] && formik.errors[name]
      ? (formik.errors[name] as string)
      : "";
  };

  const isFieldInvalid = (name: string) => {
    return !!(formik.touched[name] && formik.errors[name]);
  };

  return (
    <div className={className}>
      <HeroInput
        label={label}
        name={name}
        placeholder={placeholder}
        type={inputType}
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        startContent={renderStartContent()}
        endContent={renderEndContent()}
        isInvalid={isFieldInvalid(name)}
        errorMessage={getFieldError(name)}
        {...rest}
      />
    </div>
  );
};

export default Input;
