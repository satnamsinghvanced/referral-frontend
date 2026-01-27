import { Switch } from "@heroui/react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { toggleTheme } from "../../store/uiSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useTypedSelector((state) => state.ui.theme);

  return (
    <Switch
      size="sm"
      aria-label="Theme"
      isSelected={theme === "dark"}
      onChange={() => dispatch(toggleTheme())}
    />
  );
}
