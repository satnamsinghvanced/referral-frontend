import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Checkbox } from "@heroui/react";
import { getPublicForm, submitPublicForm } from "../../services/leadTrackingForms";

export default function LeadForm() {
  const { token } = useParams<{ token: string }>();
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Patient Intake Form";
    const loadForm = async () => {
      if (!token) return;
      try {
        const res = await getPublicForm(token);
        const payload = res;
        if (payload.success && payload.data) {
          setFormName(payload.data.formName);
          setFields(payload.data.fields);
          const initialData: Record<string, any> = {};
          payload.data.fields.forEach((f: any) => {
            initialData[f.name] = f.type === "boolean" ? false : "";
          });
          setFormData(initialData);
        } else {
          setFetchError(payload.message || "Failed to load form details.");
        }
      } catch (err: any) {
        console.error(err);
        setFetchError(err.response?.data?.message || err.message || "Link is expired or invalid.");
      } finally {
        setFetching(false);
      }
    };
    loadForm();
  }, [token]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateField = (field: any, val: any): string => {
    const name = (field.name || "").toLowerCase();
    const label = field.label || field.name;

    if (field.required) {
      if (field.type === "boolean") {
        if (val !== true) return `You must accept: ${label}`;
      } else if (val === undefined || val === null || val === "") {
        return `${label} is required`;
      }
    }

    if (!val && !field.required) return "";

    if (name === "email" || name.includes("email")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(val)) return "Please enter a valid email address";
    }

    if (name === "phone" || name.includes("phone")) {
      const phoneRegex = /^[0-9+\-\s().]{7,15}$/;
      if (!phoneRegex.test(val)) return "Phone must be 7–15 digits";
    }

    if ((name === "firstname" || name === "lastname" || name === "name") && typeof val === "string") {
      if (/[0-9!@#$%^&*_=<>{}[\]]/.test(val)) return `${label} should not contain numbers or special characters`;
    }

    if (field.type === "number" && val !== "") {
      if (isNaN(Number(val))) return `${label} must be a valid number`;
    }

    return "";
  };

  const handleBlur = (field: any) => {
    const val = formData[field.name];
    const err = validateField(field, val);
    if (err) setErrors((prev) => ({ ...prev, [field.name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = formData[field.name];
      const err = validateField(field, val);
      if (err) newErrors[field.name] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitPublicForm(token, formData);
      if (res.success) {
        setSuccess(true);
      } else {
        setErrors({ _form: res.message || "Failed to submit form." });
      }
    } catch (err: any) {
      console.error(err);
      setErrors({ _form: err.response?.data?.message || err.message || "Failed to submit form." });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading state ── */
  if (fetching) {
    return (
      <div style={styles.page}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Spinner size="lg" color="primary" />
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading intake form...</p>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (fetchError) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Form Unavailable</h3>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>{fetchError}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "pulse 2s infinite" }}>
              <svg width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Form Submitted!</h3>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>
              Your details have been successfully submitted and logged.
            </p>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>Our team will review them shortly.</p>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 20 }}>You may close this browser window.</p>
          </div>
        </div>
      </div>
    );
  }

  /* Split fields: boolean at bottom, rest in grid */
  const booleanFields = fields.filter((f) => f.type === "boolean");
  const regularFields = fields.filter((f) => f.type !== "boolean");

  return (
    <div style={styles.page}>
      <div style={{ width: "100%", maxWidth: 680 }}>

        {/* ── Header branding card ── */}
        <div style={styles.headerCard}>
          <div style={styles.headerLeft}>
            <div style={styles.practiceIcon}>
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div style={styles.practiceName}>Practice Marketer</div>
              <div style={styles.practiceSubtitle}>Patient Intake Portal</div>
            </div>
          </div>
          <div style={styles.headerRight}>
            <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>Secure Form</span>
          </div>
        </div>

        {/* ── Main form card ── */}
        <div style={styles.card}>

          {/* Form title */}
          <div style={styles.formTitleRow}>
            <span style={{ fontSize: 20 }}>⭐</span>
            <div>
              <h2 style={styles.formTitle}>{formName || "Patient Intake Form"}</h2>
              <p style={styles.formSubtitle}>Please fill out the form below and we'll contact you shortly.</p>
            </div>
          </div>

          {/* Form-level error */}
          {errors._form && (
            <div style={styles.errorBanner}>
              <svg width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errors._form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Two-column grid for regular fields ── */}
            <div style={styles.grid}>
              {regularFields.map((field) => {
                const hasError = !!errors[field.name];
                const fieldNameLower = (field.name || "").toLowerCase();
                const isPhoneField = fieldNameLower === "phone" || fieldNameLower.includes("phone");
                const isSelectField = field.type === "select";

                if (isSelectField) {
                  return (
                    <div key={field.name} style={styles.fullWidth} data-field={field.name}>
                      <label style={styles.label}>
                        {field.label}
                        {field.required && <span style={styles.required}> *</span>}
                      </label>
                      <select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        style={{ ...styles.input, ...styles.selectInput, ...(hasError ? styles.inputError : {}) }}
                      >
                        <option value="">Select {field.label}</option>
                        {(field.options || []).map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {hasError && <div style={styles.fieldError}>{errors[field.name]}</div>}
                    </div>
                  );
                }

                return (
                  <div key={field.name} data-field={field.name}>
                    <label style={styles.label}>
                      {field.label}
                      {field.required && <span style={styles.required}> *</span>}
                    </label>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      placeholder={
                        isPhoneField ? "(555) 123-4567"
                          : field.name === "email" || fieldNameLower.includes("email") ? "your.email@example.com"
                            : `Enter ${field.label.toLowerCase()}`
                      }
                      inputMode={isPhoneField ? "tel" : field.type === "number" ? "numeric" : undefined}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (isPhoneField) val = val.replace(/[^0-9+\-\s().]/g, "");
                        handleChange(field.name, val);
                      }}
                      onBlur={() => handleBlur(field)}
                      style={{ ...styles.input, ...(hasError ? styles.inputError : {}) }}
                    />
                    {hasError && <div style={styles.fieldError}>{errors[field.name]}</div>}
                  </div>
                );
              })}
            </div>

            {/* ── Boolean / checkbox fields ── */}
            {booleanFields.length > 0 && (
              <div style={styles.checkboxSection}>
                {booleanFields.map((field) => {
                  const hasError = !!errors[field.name];
                  return (
                    <div key={field.name} style={styles.checkboxRow} data-field={field.name}>
                      <Checkbox
                        isSelected={!!formData[field.name]}
                        onValueChange={(isSelected) => handleChange(field.name, isSelected)}
                        color="primary"
                        size="md"
                      >
                        <span style={styles.checkboxLabel}>
                          {field.label}
                          {field.required && <span style={styles.required}> *</span>}
                        </span>
                      </Checkbox>
                      {hasError && <div style={{ ...styles.fieldError, marginLeft: 28 }}>{errors[field.name]}</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Submit button ── */}
            <div style={styles.buttonRow}>
              <button
                type="submit"
                disabled={submitting}
                style={{ ...styles.submitBtn, ...(submitting ? styles.submitBtnDisabled : {}) }}
              >
                {submitting ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                    </svg>
                    Submit Form
                  </span>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Footer */}
        <p style={styles.footer}>🔒 Your information is encrypted and secure</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        input::placeholder, textarea::placeholder { color: #475569; }
        input:focus, select:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        select option { background: #1e293b; color: #e2e8f0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        button:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(59,130,246,0.4); }
        button { transition: all 0.2s ease; }
        input:hover:not(:focus) { border-color: #334155 !important; }
        select:hover:not(:focus) { border-color: #334155 !important; }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "32px 16px 48px",
    fontFamily: "'Inter', sans-serif",
  },
  headerCard: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%)",
    borderRadius: "14px 14px 0 0",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  practiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  practiceName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  practiceSubtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: 400,
    marginTop: 2,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "6px 14px",
  },
  card: {
    background: "#1e293b",
    borderRadius: "0 0 16px 16px",
    padding: "28px 28px 32px",
    marginBottom: 12,
    border: "1px solid #1e3a5f",
    borderTop: "none",
  },
  formTitleRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: "1px solid #1e3a5f",
  },
  formTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  formSubtitle: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 1.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 20px",
    marginBottom: 0,
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    width: "100%",
    background: "#0f172a",
    border: "1px solid #1e3a5f",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#e2e8f0",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  selectInput: {
    cursor: "pointer",
    appearance: "auto" as any,
  },
  fieldError: {
    color: "#ef4444",
    fontSize: 11,
    marginTop: 5,
    fontWeight: 500,
  },
  errorBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 20,
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: 500,
  },
  checkboxSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid #1e3a5f",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  checkboxRow: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  checkboxLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 500,
  },
  buttonRow: {
    marginTop: 28,
    display: "flex",
    gap: 12,
  },
  submitBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "13px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
    fontFamily: "'Inter', sans-serif",
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
  },
  footer: {
    color: "#334155",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
};
