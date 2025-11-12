import { FiLoader } from "react-icons/fi";

export const LoadingState = () => (
  <div className="bg-background flex items-center justify-center p-4">
    <FiLoader className="animate-spin h-6 w-6 text-primary" />
  </div>
);
