import React from "react";
import { Skeleton } from "@heroui/react";

interface TeamSkeletonProps {
  type?: "active" | "pending"; // visually distinguish pending
  count?: number; // number of items to show
}

const TeamSkeleton: React.FC<TeamSkeletonProps> = ({
  type = "active",
  count = 3,
}) => {
  const bgClass =
    type === "pending"
      ? "bg-yellow-50 border-yellow-200"
      : "bg-transparent border-foreground/10";

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-between p-3 border rounded-lg ${bgClass}`}
        >
          {/* Left side: avatar + text */}
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-32 rounded-md" />
              <Skeleton className="h-2.5 w-24 rounded-md" />
            </div>
          </div>

          {/* Right side: buttons and tags */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-7 w-14 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamSkeleton;
