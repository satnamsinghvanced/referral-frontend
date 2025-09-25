import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/uiSlice";
import { Switch } from "@heroui/react";

export default function ThemeToggle() {
  const dispatch = useDispatch();

  return (
    <Switch
      size="sm"
      aria-label="Theme"
      onChange={() => dispatch(toggleTheme())}
    />
  );
}
