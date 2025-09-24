import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/uiSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
    >
      {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
    </button>
  );
}
