import React from "react";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";

interface TrendIndicatorProps {
  status?: string | undefined;
  percentage?: number | string | undefined;
  label?: string | undefined;
  isLoading?: boolean;
  useFormattedValue?: boolean;
  valueOverride?: string | undefined;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  status,
  percentage,
  label = "from last month",
  isLoading = false,
  useFormattedValue = true,
  valueOverride,
}) => {
  if (isLoading) {
    return <span className="text-gray-500 text-xs items-center">...</span>;
  }

  const numPercentage =
    typeof percentage === "string" ? parseFloat(percentage) : percentage || 0;

  const isIncrement =
    status === "increment" || (status === "" && numPercentage > 0);
  const isDecrement =
    status === "decrement" || (status === "" && numPercentage < 0);

  const colorClass = isIncrement
    ? "text-emerald-600 dark:text-emerald-400"
    : isDecrement
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500";

  const Icon = isIncrement ? LuTrendingUp : isDecrement ? LuTrendingDown : null;

  return (
    <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
      {Icon && <Icon className="text-sm" />}
      <span className="font-medium">
        {valueOverride ? (
          valueOverride
        ) : (
          <>
            {useFormattedValue && numPercentage > 0 ? "+" : ""}
            {numPercentage}%
          </>
        )}
      </span>
      {label && <span className="">{label}</span>}
    </div>
  );
};

export default TrendIndicator;
