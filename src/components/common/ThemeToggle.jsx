import { useDispatch, useSelector } from "react-redux";
import { FaMoon, FaSun } from "react-icons/fa";
import { toggleTheme } from "../../store/uiSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
    >
      {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
}
