import { useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  const { theme } = useTypedSelector((state) => state.ui);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
export default App;