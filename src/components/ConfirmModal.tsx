import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'ยืนยันการลบ',
  cancelText = 'ยกเลิก',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="confirm-modal-box"
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-modal"
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors p-1 rounded-lg ${
            isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isDestructive
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
            }`}
          >
            {isDestructive ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1 pr-4">
            <h3 id="confirm-modal-title" className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h3>
            <p id="confirm-modal-desc" className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            id="btn-cancel-modal"
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-sm transition-all border ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            {cancelText}
          </button>
          <button
            id="btn-confirm-modal"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30'
            }`}
          >
            {isDestructive && <Trash2 className="w-4 h-4" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
