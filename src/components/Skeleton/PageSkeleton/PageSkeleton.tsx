"use client";

import React from "react";

const PageSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="relative z-10 bg-white dark:bg-neutral-900 shadow-lg rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-[90vw] p-8 my-10">
        <div className="animate-pulse space-y-4">
          {/* Circle Skeleton */}
          <div className="flex gap-3">
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-[8em] mt-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Other Skeleton Elements */}
          <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
