import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { toggleTheme } from "../../store/uiSlice";

export const AuthThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.ui.theme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className={`p-2.5 rounded-xl border shadow-xs text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer select-none ${isDark
        ? "bg-[#111A2E] border-[#1E2B45] text-amber-400 hover:bg-[#1E2B45]/80"
        : "bg-white border-slate-200/90 text-[#1E3A8A] hover:bg-slate-50 shadow-slate-200/50"
        }`}
    >
      {isDark ? (
        <>
          <FiSun className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <FiMoon className="w-4 h-4 text-[#1E3A8A] shrink-0" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default AuthThemeToggle;
