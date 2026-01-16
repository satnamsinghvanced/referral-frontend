import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "No data to display",
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 dark:text-gray-400">
      {icon && <div className="mb-3">{icon}</div>}
      <p className="text-sm font-medium">{title}</p>
      {message && <p className="text-xs mt-1.5">{message}</p>}
    </div>
  );
};

export default EmptyState;
