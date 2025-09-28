import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  profileName: string;
}

export const ConfirmationModal = ({ isOpen, onConfirm, onCancel, profileName }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Confirm Workstation Change</h2>
        <p className="text-slate-600 mb-6">Are you sure you want to switch this device to the <span className="font-bold">{profileName}</span> workstation?</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-kuka-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Switch
          </button>
        </div>
      </div>
    </div>
  );
};
