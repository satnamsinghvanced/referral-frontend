import { useState } from "react";
import { useFormik } from "formik";
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
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res: any = await api.post("/superadmin/login", {
          email: values.email,
          password: values.password,
        });

        if (res.success || res.data?.accessToken || res.accessToken) {
          const token = res.data?.accessToken || res.accessToken || "";
          localStorage.setItem("superadmin_email", values.email.toLowerCase().trim());
          dispatch(
            setCredentials({
              token,
            })
          );
          navigate("/admin");
        } else {
          setErrorMsg(res.message || "Failed to login");
        }
      } catch (error: any) {
        setErrorMsg(
          error.response?.data?.message ||
            error.message ||
            "Invalid email or password"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white">
      {/* White Login Box Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          {/* Icon Logo inside box on top */}
          <div className="mb-3">
            <img
              src="/practiceroi-favicon.ico"
              alt="Practice ROI"
              className="w-12 h-12 object-contain"
            />
          </div>
          {/* Title: Admin Portal */}
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Platform-wide administrative portal access
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@practiceroi.com"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={isVisible ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {isVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#20a9f8" }}
            className="w-full py-3 px-4 hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminSignIn;
