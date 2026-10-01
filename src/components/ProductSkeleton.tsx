import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between animate-pulse">
      <div className="bg-zinc-900 h-64 w-full"></div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
          <div className="h-3 bg-zinc-800 rounded w-1/6"></div>
        </div>
        <div className="h-5 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-900 rounded w-full"></div>
        <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
          <div className="h-6 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-9 bg-zinc-800 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};
