import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center transform transition-all border border-slate-100">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl">
          <AlertCircle className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-bold font-fredoka text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-fredoka font-semibold rounded-2xl text-base shadow-md transition active:scale-98"
        >
          Faham
        </button>
      </div>
    </div>
  );
};
