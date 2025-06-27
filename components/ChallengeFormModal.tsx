
import React, { useState, useEffect, useRef } from 'react';
import { Challenge } from '../types';

interface ChallengeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (challenge: Partial<Challenge>) => void;
  initialData?: Challenge | Partial<Challenge> | null;
}

const backLine1Options = [
  "GenAI Architect",
  "GenAI Engineer",
  "Experience Designer"
];

const ChallengeFormModal: React.FC<ChallengeFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Challenge>>({
    titleLine1: '',
    titleLine2: '',
    frontImageUrl: '',
    backTextLine1: backLine1Options[0], 
    backTextLine2: '',
    linkUrl: '',
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false); // True if frontImageUrl comes from file upload
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (initialData) {
      const initialBackTextLine1 = initialData.backTextLine1 && backLine1Options.includes(initialData.backTextLine1)
        ? initialData.backTextLine1
        : backLine1Options[0];
      
      const fullInitialData = {
        ...initialData,
        backTextLine1: initialBackTextLine1,
        linkUrl: initialData.linkUrl || '',
        frontImageUrl: initialData.frontImageUrl || '',
      };
      setFormData(fullInitialData);

      if (initialData.frontImageUrl) {
        if (initialData.frontImageUrl.startsWith('data:image')) {
          setIsUploading(true);
        } else {
          setIsUploading(false);
        }
        setImagePreviewUrl(initialData.frontImageUrl);
      } else {
        setImagePreviewUrl(null);
        setIsUploading(false);
      }

    } else {
      // Reset for new challenge
      setFormData({ 
        titleLine1: '', 
        titleLine2: '',
        frontImageUrl: '', 
        backTextLine1: backLine1Options[0], 
        backTextLine2: '',
        linkUrl: '', 
      });
      setImagePreviewUrl(null);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'frontImageUrl') {
        setIsUploading(false); // User is typing a URL, so not uploading
        setImagePreviewUrl(value); // Update preview from URL
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear file input if URL is manually entered
        }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData(prev => ({ ...prev, frontImageUrl: dataUrl }));
        setImagePreviewUrl(dataUrl);
        setIsUploading(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUploadedImage = () => {
    setFormData(prev => ({ ...prev, frontImageUrl: '' }));
    setImagePreviewUrl(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleLine1 || !formData.backTextLine1) {
        alert("Please fill in Challenge Title - Line 1 and select a value for Back - Line 1.");
        return;
    }
    
    onSave(formData); 
  };

  const inputClass = "w-full p-3 bg-[#fffef7] border border-[#d0c5a0] rounded-md text-[#0e181f] placeholder-neutral-500 focus:ring-2 focus:ring-[#f0a080] focus:border-[#ef6140] outline-none transition-colors";
  const fileInputClass = "w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ef6140]/20 file:text-[#ef6140] hover:file:bg-[#ef6140]/30";
  const selectClass = "w-full p-3 bg-[#fffef7] border border-[#d0c5a0] rounded-md text-[#0e181f] focus:ring-2 focus:ring-[#f0a080] focus:border-[#ef6140] outline-none transition-colors appearance-none";
  const labelClass = "block text-sm font-medium text-[#5c5a52] mb-1";
  const helperTextClass = "text-xs text-neutral-600 mt-1";

  return (
    <div className="fixed inset-0 bg-[#0e181f]/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog" aria-labelledby="modal-title">
      <div className="bg-[#fdf6e3] p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[#ef6140] overflow-y-auto max-h-[90vh]">
        <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-[#0e181f] mb-6">
          {initialData && 'id' in initialData && initialData.id ? 'Edit Challenge' : 'Add New Challenge'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="titleLine1" className={labelClass}>Challenge Title - Line 1</label>
            <input type="text" name="titleLine1" id="titleLine1" value={formData.titleLine1 || ''} onChange={handleInputChange} className={inputClass} placeholder="e.g., Master Advanced Algorithms" required />
          </div>
          <div>
            <label htmlFor="titleLine2" className={labelClass}>Challenge Title - Line 2 (Optional)</label>
            <input type="text" name="titleLine2" id="titleLine2" value={formData.titleLine2 || ''} onChange={handleInputChange} className={inputClass} placeholder="e.g., Data Structures Focus" />
          </div>

          {/* Image Upload and URL Input Section */}
          <div className="space-y-3">
            <div>
              <label htmlFor="frontImageUpload" className={labelClass}>Upload Front Image (Overrides URL)</label>
              <input 
                type="file" 
                id="frontImageUpload" 
                name="frontImageUpload"
                accept="image/*" 
                onChange={handleFileChange} 
                className={fileInputClass}
                ref={fileInputRef}
              />
            </div>

            {isUploading && imagePreviewUrl && (
              <div className="mt-2 text-center">
                <button 
                  type="button" 
                  onClick={handleRemoveUploadedImage} 
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove Uploaded Image
                </button>
              </div>
            )}

            <div>
              <label htmlFor="frontImageUrl" className={labelClass}>Or Enter Front Image URL</label>
              <input 
                type="url" 
                name="frontImageUrl" 
                id="frontImageUrl" 
                value={isUploading ? '' : formData.frontImageUrl || ''} // Clear URL if uploading
                onChange={handleInputChange} 
                className={inputClass} 
                placeholder="https://example.com/image.png" 
                disabled={isUploading} // Disable if an image is uploaded
              />
              <p className={helperTextClass}>
                {isUploading ? "Using uploaded image." : "Provide a direct URL. Leave blank for placeholder."}
              </p>
            </div>
          </div>
          
          {imagePreviewUrl && (
            <div className="mt-4 border border-[#d0c5a0] rounded-md p-2">
              <p className={`${labelClass} mb-1 text-center`}>Image Preview:</p>
              <img src={imagePreviewUrl} alt="Preview" className="max-w-full h-auto max-h-40 mx-auto rounded-md object-contain" />
            </div>
          )}


          <div>
            <label htmlFor="linkUrl" className={labelClass}>Link URL (Optional)</label>
            <input type="url" name="linkUrl" id="linkUrl" value={formData.linkUrl || ''} onChange={handleInputChange} className={inputClass} placeholder="https://example.com/more-info" />
            <p className={helperTextClass}>If provided, clicking the card will open this URL.</p>
          </div>
          <div>
            <label htmlFor="backTextLine1" className={labelClass}>Back - Line 1 (Bold)</label>
            <div className="relative">
              <select 
                name="backTextLine1" 
                id="backTextLine1" 
                value={formData.backTextLine1 || ''} 
                onChange={handleInputChange} 
                className={selectClass}
                required 
              >
                {backLine1Options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-600">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615l-3.712 3.707c-.533.48-1.043.48-1.576 0l-3.712-3.707c-.408-.418-.436-1.17 0-1.615z"/></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="backTextLine2" className={labelClass}>Back - Line 2</label>
            <input type="text" name="backTextLine2" id="backTextLine2" value={formData.backTextLine2 || ''} onChange={handleInputChange} className={inputClass} placeholder="e.g., Supporting detail or benefit" />
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
              Save Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeFormModal;
