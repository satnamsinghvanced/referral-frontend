import { useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";
import AppRoutes from "./routes";

function App() {
  const { theme } = useTypedSelector((state) => state.ui);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Handle initial load to prevent flash if necessary, though useEffect is fast enough here.
  // The Redux store initializes with localStorage value, so this runs on mount and sets class correctly.

  return <AppRoutes />;
}

export default App;
