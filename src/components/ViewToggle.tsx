// DISABLED VIEW TOGGLE FOR NOW - TO BE RE-ENABLED IN FUTURE
/*
import React from 'react';
import { CubeIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ViewToggleProps {
  is3D: boolean;
  onToggle: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ is3D, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="p-2 hover:bg-white/5 rounded-full transition-all border border-white/10 hover:scale-110 flex items-center gap-2"
      title={`Switch to ${is3D ? '2D' : '3D'} view`}
    >
      {is3D ? (
        <>
          <ClockIcon className="w-6 h-6" />
          <span className="text-sm">2D</span>
        </>
      ) : (
        <>
          <CubeIcon className="w-6 h-6" />
          <span className="text-sm">3D</span>
        </>
      )}
    </button>
  );
};

export default ViewToggle;
*/
