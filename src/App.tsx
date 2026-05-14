import { useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";
import AppRoutes from "./routes";
function App() {
  const { theme } = useTypedSelector((state) => state.ui);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return <AppRoutes />;
}
export default App;
