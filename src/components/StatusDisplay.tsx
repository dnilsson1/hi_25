import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import type { StatusType } from '../types';

interface StatusDisplayProps {
  status: StatusType;
  message: string;
}

export const StatusDisplay = ({ status, message }: StatusDisplayProps) => {
  if (status === 'idle' || !message) {
    return <div className="h-14"></div>; // Reserve space
  }

  const baseClasses = 'flex items-center justify-center p-4 rounded-lg text-sm font-medium transition-opacity duration-300';
  let specificClasses = '';
  let IconComponent = null;

  switch (status) {
    case 'loading':
      specificClasses = 'bg-blue-100 text-blue-800';
      IconComponent = LoadingSpinnerIcon;
      break;
    case 'success':
      specificClasses = 'bg-green-100 text-green-800';
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      specificClasses = 'bg-red-100 text-red-800';
      IconComponent = XCircleIcon;
      break;
  }

  return (
    <div className={`h-14 w-full ${baseClasses} ${specificClasses}`}>
      {IconComponent && <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />}
      <span className="text-center">{message}</span>
    </div>
  );
};
