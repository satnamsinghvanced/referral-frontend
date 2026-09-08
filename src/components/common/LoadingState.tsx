import React from "react";
import { FiLoader } from "react-icons/fi";
import Logo from "../ui/Logo";

export const LoadingState = () => (
  <div className="flex items-center justify-center p-4">
    <FiLoader className="animate-spin h-6 w-6 text-primary" />
  </div>
);

interface WorkspaceLoaderProps {
  message?: string;
  text?: string;
  minHeight?: string;
}

export const WorkspaceLoader: React.FC<WorkspaceLoaderProps> = ({
  message,
  text,
  minHeight = "min-h-[360px]",
}) => {
  const displayMessage = message || text || "LOADING...";
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center py-12 transition-all`}>
      <div className="flex flex-col items-center gap-6">
        <Logo style={{ height: "90px" }} className="animate-pulse" />
        <div className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span>{displayMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLoader;
