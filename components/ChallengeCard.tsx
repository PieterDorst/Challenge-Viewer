
import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  isEditMode?: boolean;
  onEdit?: (challenge: Challenge) => void;
  onRemove?: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isEditMode, onEdit, onRemove }) => {
  const { titleLine1, titleLine2, frontImageUrl, altText, backTextLine1, backTextLine2, id, linkUrl } = challenge;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    // If the card is a link, prevent navigation when clicking edit in edit mode
    if (linkUrl && isEditMode) e.preventDefault();
    onEdit?.(challenge);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If the card is a link, prevent navigation when clicking remove in edit mode
    if (linkUrl && isEditMode) e.preventDefault();
    onRemove?.(id);
  };

  const combinedTitleForDisplay = altText;
  const cardAriaLabel = linkUrl 
    ? `Challenge: ${combinedTitleForDisplay}. Links to an external site.` 
    : `Challenge: ${combinedTitleForDisplay}`;

  const CardInteractiveWrapper = linkUrl && !isEditMode ? 'a' : 'div';
  const wrapperProps = linkUrl && !isEditMode
    ? {
        href: linkUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  // Stop propagation for card clicks in edit mode to prevent link navigation if it's an 'a' tag
  const handleCardClickInEditMode = (e: React.MouseEvent) => {
    if (isEditMode && linkUrl) {
      e.preventDefault();
    }
  };


  return (
    <div className="flex flex-col items-center w-72">
      <div className="mb-3 text-center flex flex-col items-center justify-center break-words w-full px-1 h-[7rem]" title={combinedTitleForDisplay}>
        <span className="block text-[#0e181f] uppercase font-ropa font-normal text-4xl leading-[0.8]">{titleLine1}</span>
        {titleLine2 && <span className="block w-full truncate text-[#ef6140] text-base font-medium uppercase [text-shadow:1px_1px_0px_#A03D20]">{titleLine2}</span>}
      </div>

      <CardInteractiveWrapper
        className="w-full h-[24.625rem] rounded-xl [perspective:1000px] group cursor-pointer block"
        aria-label={cardAriaLabel}
        onClick={handleCardClickInEditMode}
        {...wrapperProps}
      >
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front Face */}
          <div className="absolute w-full h-full [backface-visibility:hidden] overflow-hidden rounded-xl shadow-2xl border-2 border-[#ef6140]">
            <img src={frontImageUrl || 'https://via.placeholder.com/400x600/334155/94a3b8?text=No+Image'} alt={combinedTitleForDisplay} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
          </div>
          {/* Back Face */}
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#ef6140] text-white rounded-xl shadow-2xl p-6 flex flex-col justify-center items-center text-center border-2 border-[#c04328]">
            <p className="text-xl font-bold">{backTextLine1}</p>
            <p className="mt-3 text-md">{backTextLine2}</p>
          </div>
        </div>
      </CardInteractiveWrapper>

      {isEditMode && onEdit && onRemove && (
        <div className="mt-3 flex space-x-3">
          <button
            onClick={handleEditClick}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 text-sm"
            aria-label={`Edit ${combinedTitleForDisplay}`}
          >
            Edit
          </button>
          <button
            onClick={handleRemoveClick}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 text-sm"
            aria-label={`Remove ${combinedTitleForDisplay}`}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
