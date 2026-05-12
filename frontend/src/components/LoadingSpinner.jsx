import React from 'react';

const LoadingSpinner = ({ message = "載入中..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      <span className="text-slate-400 font-bold text-sm tracking-widest uppercase">
        {message}
      </span>
    </div>
  );
};

export default LoadingSpinner;