// components/ui/Input.tsx
import React, { useState, ReactNode, FocusEventHandler } from "react";
import { Input as HeroInput } from "@heroui/react";
import { IoMdMail } from "react-icons/io";
import { FaLock, FaEyeSlash } from "react-icons/fa";
import { TbEyeFilled } from "react-icons/tb";

interface InputProps {
  label: string;
  name?: string;
  placeholder?: string;
  type?: string;
  value: any;
  className?: string;
  // Remove formik prop and use individual props instead
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  error?: string;
  touched?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isRequired?: boolean | undefined;
  [key: string]: any;
}

const Input = ({
  label,
  name = "",
  placeholder = "",
  type = "text",
  value,
  className,
  onChange,
  onBlur,
  error,
  touched = false,
  startContent,
  endContent,
  isRequired = false,
  ...rest
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const inputType =
    type === "password" ? (passwordVisible ? "text" : "password") : type;

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

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const isInvalid = touched && !!error;

  return (
    <div className={className}>
      <HeroInput
        label={label}
        name={name}
        placeholder={placeholder}
        radius="sm"
        type={inputType}
        value={value}
        onValueChange={handleValueChange} // passes the new string
        onBlur={onBlur || (() => {})}
        startContent={renderStartContent()}
        endContent={renderEndContent()}
        isInvalid={isInvalid}
        errorMessage={isInvalid ? error : ""}
        {...rest}
        className="w-full"
        isRequired={isRequired}
      />
    </div>
  );
};

export default Input;
