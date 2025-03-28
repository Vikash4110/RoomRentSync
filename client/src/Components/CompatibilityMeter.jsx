import React from 'react';

const CompatibilityMeter = ({ score, className = '' }) => {
  const getColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-teal-400';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Compatibility</span>
        <span className="text-sm font-bold" style={{ color: getColor(score).replace('bg-', 'text-') }}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColor(score)}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CompatibilityMeter;