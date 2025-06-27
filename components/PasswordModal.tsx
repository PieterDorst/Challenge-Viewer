
import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    // Do not clear password here, App.tsx will decide if it was correct
    // If incorrect, user might want to see what they typed
  };

  const inputClass = "w-full p-3 bg-[#fffef7] border border-[#d0c5a0] rounded-md text-[#0e181f] placeholder-neutral-500 focus:ring-2 focus:ring-[#f0a080] focus:border-[#ef6140] outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-[#5c5a52] mb-1";

  return (
    <div className="fixed inset-0 bg-[#0e181f]/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog" aria-labelledby="password-modal-title">
      <div className="bg-[#fdf6e3] p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm border border-[#ef6140]">
        <h2 id="password-modal-title" className="text-2xl font-bold text-[#0e181f] mb-6 text-center">Enter Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputClass} 
              placeholder="Enter management password"
              autoFocus
              required 
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto py-2 px-5 bg-transparent text-[#ef6140] hover:bg-[#ef6140]/10 border border-[#ef6140] rounded-md font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="w-full sm:w-auto py-2 px-5 bg-[#ef6140] hover:bg-[#d05030] text-white rounded-md font-semibold transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
