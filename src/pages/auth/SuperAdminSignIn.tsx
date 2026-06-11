import {
  Button,
  Card,
  CardBody,
  Input,
  Spinner,
} from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setCredentials } from "../../store/authSlice";
import api from "../../services/axios";

interface FormData {
  email: string;
  password: string;
}

const SuperAdminSignIn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formik = useFormik<FormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
      password: Yup.string()
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await api.post("/superadmin/login", {
          email: values.email,
          password: values.password,
        });
        if (res.data.success) {
          dispatch(
            setCredentials({
              token: res.data.accessToken || "",
            })
          );
          navigate("/");
        } else {
          setErrorMsg(res.data.message || "Failed to login");
        }
      } catch (error: any) {
        setErrorMsg(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-foreground/10 bg-content1 backdrop-blur-xl">
        <CardBody className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              Super Admin Login
            </h1>
            <p className="text-sm text-foreground/60">
              Platform-wide administrative access
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex">
              <Input
                label="Email Address"
                labelPlacement="inside"
                name="email"
                placeholder="Enter your email"
                type="email"
                radius="sm"
                variant="flat"
                value={formik.values.email}
                onValueChange={(value) =>
                  formik.setFieldValue("email", value)
                }
                onBlur={formik.handleBlur}
                errorMessage={
                  formik.touched.email && (formik.errors.email as string)
                }
                isInvalid={!!(formik.touched.email && formik.errors.email)}
                isRequired
              />
            </div>
            <div className="flex">
              <Input
                label="Password"
                labelPlacement="inside"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                name="password"
                radius="sm"
                variant="flat"
                value={formik.values.password}
                onValueChange={(value) =>
                  formik.setFieldValue("password", value)
                }
                onBlur={formik.handleBlur}
                errorMessage={
                  formik.touched.password &&
                  (formik.errors.password as string)
                }
                isInvalid={
                  !!(formik.touched.password && formik.errors.password)
                }
                isRequired
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </div>

            {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

            <Button
              size="lg"
              radius="md"
              type="submit"
              color="primary"
              variant="solid"
              isLoading={loading}
              spinner={<Spinner color="white" size="sm" />}
              isDisabled={loading}
              className="mt-2 font-semibold"
              fullWidth
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SuperAdminSignIn;
