import React from "react";

interface LoadingSkeletonProps {
  count?: number; // Número de elementos de carga
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex flex-col border-b border-gray-200 py-3">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};
