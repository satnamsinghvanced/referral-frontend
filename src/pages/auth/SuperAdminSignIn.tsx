import { useState, useRef } from "react";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiSun, FiMoon, FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setCredentials } from "../../store/authSlice";
import { setTheme } from "../../store/uiSlice";
import { RootState } from "../../store";
import { loginSuperAdmin, forgotSuperAdminPassword } from "../../services/superadmin";

interface FormData {
  email: string;
  password: string;
}

const SuperAdminSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lastSwitchTimeRef = useRef<number>(0);

  const reduxTheme = useSelector((state: RootState) => state.ui?.theme);
  const storedTheme = localStorage.getItem("theme");
  const currentTheme = storedTheme || reduxTheme || "dark";
  const isDark = currentTheme === "dark";

  const handleToggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    dispatch(setTheme(nextTheme));
  };

  const [view, setView] = useState<"signin" | "forgot">("signin");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotErrorMsg, setForgotErrorMsg] = useState("");
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState("");

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
      // Guard against ghost clicks when switching views
      if (Date.now() - lastSwitchTimeRef.current < 400) {
        return;
      }
      setLoading(true);
      setErrorMsg("");
      try {
        const res: any = await loginSuperAdmin({
          email: values.email,
          password: values.password,
        });

        const token = res?.accessToken || res?.data?.accessToken || "";

        if (token || res?.success) {
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

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotErrorMsg("Please enter a valid email address");
      return;
    }

    setForgotLoading(true);
    setForgotErrorMsg("");
    setForgotSuccessMsg("");

    try {
      const res: any = await forgotSuperAdminPassword({
        email: forgotEmail.trim(),
      });

      const message =
        res?.message ||
        res?.data?.message ||
        "Password reset link sent to your email successfully.";
      setForgotSuccessMsg(message);
    } catch (error: any) {
      setForgotErrorMsg(
        error.response?.data?.message ||
        error.message ||
        "Failed to send password reset link. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const switchToForgot = () => {
    lastSwitchTimeRef.current = Date.now();
    setForgotEmail(formik.values.email || "");
    setForgotErrorMsg("");
    setForgotSuccessMsg("");
    setErrorMsg("");
    setView("forgot");
  };

  const switchToSignIn = () => {
    lastSwitchTimeRef.current = Date.now();
    setForgotErrorMsg("");
    setForgotSuccessMsg("");
    setErrorMsg("");
    formik.setFieldValue("password", "");
    if (forgotEmail) {
      formik.setFieldValue("email", forgotEmail.trim());
    }
    setView("signin");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 relative ${isDark ? "bg-[#070C18] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
        }`}
    >
      {/* Theme Toggle Button at top right */}
      <button
        type="button"
        onClick={handleToggleTheme}
        className={`absolute top-5 right-5 p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center gap-2 text-xs font-bold ${isDark
            ? "bg-[#111A2E] border-[#1E2B45] text-amber-400 hover:bg-[#1A2642]"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        title="Toggle Light/Dark Theme"
      >
        {isDark ? (
          <>
            <FiSun className="text-amber-400 text-base" />
            <span className="hidden sm:inline">Light Mode</span>
          </>
        ) : (
          <>
            <FiMoon className="text-slate-600 text-base" />
            <span className="hidden sm:inline">Dark Mode</span>
          </>
        )}
      </button>

      {/* Card Container */}
      <div
        className={`w-full max-w-md border rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 transition-colors duration-300 ${isDark
            ? "bg-[#111A2E] border-[#1E2B45] text-white shadow-black/60"
            : "bg-white border-slate-200/90 text-slate-900 shadow-slate-200/60"
          }`}
      >
        {view === "signin" ? (
          <div key="signin-view" className="space-y-6">
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
              <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Admin Portal
              </h1>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Platform-wide administrative portal access
              </p>
            </div>

            <form key="signin-form" onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@practiceroi.com"
                  className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${isDark
                      ? "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:bg-[#070C18] focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                      : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••••••"
                    className={`w-full text-sm rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none transition-all ${isDark
                        ? "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:bg-[#070C18] focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                        : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      }`}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className={`absolute right-3 top-3 cursor-pointer transition-colors ${isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    {isVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                )}
              </div>

              {errorMsg && (
                <div className={`p-3 rounded-xl text-xs text-center font-medium ${isDark
                    ? "bg-red-950/40 border border-red-800/50 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                  }`}>
                  {errorMsg}
                </div>
              )}
              <div className="flex items-center justify-end mb-1.5">
                <button
                  type="button"
                  onClick={switchToForgot}
                  className="text-xs font-medium text-[#20a9f8] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
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
        ) : (
          <div key="forgot-view" className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                <img
                  src="/practiceroi-favicon.ico"
                  alt="Practice ROI"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Reset Password
              </h1>
              <p className={`text-xs mt-1 max-w-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Enter your Super Admin email address to receive a secure password reset link.
              </p>
            </div>

            <form key="forgot-form" onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@practiceroi.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={`w-full text-sm rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none transition-all ${isDark
                        ? "bg-[#070C18] border border-[#1E2B45] text-white placeholder-slate-500 focus:bg-[#070C18] focus:border-[#20a9f8] focus:ring-2 focus:ring-[#20a9f8]/20"
                        : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      }`}
                  />
                  <FiMail className={`absolute right-3 top-3.5 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                </div>
              </div>

              {forgotErrorMsg && (
                <div className={`p-3 rounded-xl text-xs text-center font-medium ${isDark
                    ? "bg-red-950/40 border border-red-800/50 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                  }`}>
                  {forgotErrorMsg}
                </div>
              )}

              {forgotSuccessMsg && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${isDark
                    ? "bg-emerald-950/40 border border-emerald-800/50 text-emerald-300"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  }`}>
                  <FiCheckCircle className="text-emerald-500 text-base shrink-0 mt-0.5" />
                  <span>{forgotSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                style={{ backgroundColor: "#20a9f8" }}
                className="w-full py-3 px-4 hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {forgotLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>

            <button
              type="button"
              key="back-to-signin-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                switchToSignIn();
              }}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${isDark
                  ? "text-slate-400 hover:text-white hover:bg-[#1E2B45]/40"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
            >
              <FiArrowLeft className="text-sm" />
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminSignIn;
