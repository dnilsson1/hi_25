import React from 'react';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';

interface MissionButtonProps {
  label: string;
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const MissionButton = ({ label, onClick, isLoading, disabled }: MissionButtonProps) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full flex items-center justify-center text-center px-6 py-5
        text-lg font-semibold text-white rounded-2xl shadow-lg 
        transition-all duration-200 ease-in-out transform 
        focus:outline-none focus:ring-4 focus:ring-kuka-orange focus:ring-opacity-50
        ${isDisabled
          ? 'bg-slate-400 cursor-not-allowed'
          : 'bg-kuka-orange hover:bg-orange-600 active:scale-95'
        }
      `}
    >
      {isLoading ? (
        <div className="flex items-center">
          <LoadingSpinnerIcon className="w-6 h-6 mr-3" />
          <span>Sending...</span>
        </div>
      ) : (
        label
      )}
    </button>
  );
};