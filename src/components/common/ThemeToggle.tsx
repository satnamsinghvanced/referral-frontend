import { Switch } from "@heroui/react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../store/uiSlice";

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
