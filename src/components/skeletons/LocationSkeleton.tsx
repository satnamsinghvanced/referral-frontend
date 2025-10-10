import React from "react";
import { Skeleton } from "@heroui/react";

interface LocationSkeletonProps {
  count?: number;
}

const LocationSkeleton: React.FC<LocationSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-3 border border-foreground/10 rounded-lg flex items-start justify-between"
        >
          {/* Left side: title and address */}
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-10 rounded-md" />
            </div>
            <Skeleton className="h-3 w-48 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>

          {/* Right side: edit/delete buttons */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSkeleton;
