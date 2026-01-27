import React from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#181c20] p-3 border border-gray-200 dark:border-white/10 shadow-xl rounded-lg outline-none min-w-[120px]">
        {label && (
          <p className="text-sm font-semibold mb-2 text-foreground">{label}</p>
        )}
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const isCurrency =
              entry.name?.toLowerCase().includes("budget") ||
              entry.name?.toLowerCase().includes("spend") ||
              entry.name?.toLowerCase().includes("cost") ||
              entry.name?.toLowerCase().includes("revenue");

            return (
              <p
                key={index}
                className="text-xs font-medium"
                style={{ color: entry.color || entry.fill }}
              >
                {entry.name}: {isCurrency ? "$" : ""}
                {entry.value?.toLocaleString()}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
