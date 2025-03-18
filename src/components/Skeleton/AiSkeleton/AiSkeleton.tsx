import React from 'react';

const AiSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 p-4 max-w-[90vw]">
      <div className="flex items-center">
        <span className="text-yellow-500 animate-pulse">★</span>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-2"></div>
      </div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="flex items-center">
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <span className="text-yellow-500 ml-2 animate-pulse">★</span>
      </div>
    </div>
  );
}

export default AiSkeleton;