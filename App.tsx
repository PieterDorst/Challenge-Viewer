
import React, { useState, useEffect } from 'react';
import ChallengeCard from './components/ChallengeCard';
import ChallengeFormModal from './components/ChallengeFormModal';
import PasswordModal from './components/PasswordModal'; // Import the new modal
import { Challenge } from './types';

const initialChallenges: Challenge[] = [
  {
    id: '1',
    titleLine1: 'Master Time Management',
    titleLine2: 'Techniques & Strategies',
    frontImageUrl: 'https://picsum.photos/seed/challengeTM/400/600',
    altText: 'Master Time Management: Techniques & Strategies',
    backTextLine1: 'Organize Your Schedule',
    backTextLine2: 'Meet deadlines effectively.',
    linkUrl: 'https://en.wikipedia.org/wiki/Time_management', // Example link
  },
  {
    id: '2',
    titleLine1: 'Ace Your Exams',
    titleLine2: 'With Effective Study Habits',
    frontImageUrl: 'https://picsum.photos/seed/challengeExams/400/600',
    altText: 'Ace Your Exams: With Effective Study Habits',
    backTextLine1: 'Develop Smart Study Habits',
    backTextLine2: 'Understand concepts deeply.',
  },
  {
    id: '3',
    titleLine1: 'Improve Public Speaking',
    // titleLine2 intentionally omitted to show it's optional
    frontImageUrl: 'https://picsum.photos/seed/challengePS/400/600',
    altText: 'Improve Public Speaking',
    backTextLine1: 'Practice Confident Presenting',
    backTextLine2: 'Engage your audience well.',
  },
   {
    id: '4',
    titleLine1: 'Boost Critical Thinking',
    titleLine2: 'For Problem Solving',
    frontImageUrl: 'https://picsum.photos/seed/challengeCT/400/600',
    altText: 'Boost Critical Thinking: For Problem Solving',
    backTextLine1: 'Analyze Problems Logically',
    backTextLine2: 'Make informed decisions.',
  },
  {
    id: '5',
    titleLine1: 'Expand Your Network',
    titleLine2: 'Professionally',
    frontImageUrl: 'https://picsum.photos/seed/challengeNetwork/400/600',
    altText: 'Expand Your Network: Professionally',
    backTextLine1: 'Build Meaningful Connections',
    backTextLine2: 'Attend events and reach out.',
  },
  {
    id: '6',
    titleLine1: 'Learn a New Skill',
    titleLine2: 'Like Coding or a Language',
    frontImageUrl: 'https://picsum.photos/seed/challengeSkill/400/600',
    altText: 'Learn a New Skill: Like Coding or a Language',
    backTextLine1: 'Dedicate Daily Practice Time',
    backTextLine2: 'Track progress consistently.',
  },
];

const App: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const savedChallenges = localStorage.getItem('studentChallenges');
    if (savedChallenges) {
        const parsed = JSON.parse(savedChallenges);
        return parsed.map((ch: any) => {
            if (ch.title && !ch.titleLine1) { // Basic migration from old format
                return { ...ch, titleLine1: ch.title, altText: ch.altText || ch.title, title: undefined, linkUrl: ch.linkUrl || '' };
            }
            // Ensure altText is present from titleLine1 and titleLine2 if missing
            if (!ch.altText && ch.titleLine1) {
                ch.altText = `${ch.titleLine1}${ch.titleLine2 ? ' ' + ch.titleLine2 : ''}`.trim();
            }
            return { ...ch, linkUrl: ch.linkUrl || undefined }; // Ensure linkUrl is either string or undefined
        });
    }
    return initialChallenges;
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | Partial<Challenge> | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);

  const MANAGE_MODE_PASSWORD = "aicards";

  useEffect(() => {
    localStorage.setItem('studentChallenges', JSON.stringify(challenges));
  }, [challenges]);

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === MANAGE_MODE_PASSWORD) {
      setIsEditMode(true);
      setShowPasswordPrompt(false);
    } else {
      alert('Incorrect password!');
    }
  };

  const handleAddNewChallenge = () => {
    setEditingChallenge({ linkUrl: '' }); // Initialize with empty linkUrl for new challenges
    setShowChallengeModal(true);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setShowChallengeModal(true);
  };

  const handleRemoveChallenge = (challengeId: string) => {
    setChallenges(prevChallenges => prevChallenges.filter(c => c.id !== challengeId));
  };

  const handleSaveChallenge = (challengeData: Partial<Challenge>) => {
    const altText = `${challengeData.titleLine1 || ''}${challengeData.titleLine2 ? ' ' + challengeData.titleLine2 : ''}`.trim();
    
    // Ensure linkUrl is either a string or undefined (empty string becomes undefined)
    const linkUrl = challengeData.linkUrl && challengeData.linkUrl.trim() !== '' ? challengeData.linkUrl.trim() : undefined;

    const fullChallengeData = { ...challengeData, altText, linkUrl } as Challenge;


    if ('id' in fullChallengeData && fullChallengeData.id) {
      // Update existing challenge
      setChallenges(challenges.map(c => c.id === fullChallengeData.id ? fullChallengeData : c));
    } else {
      // Add new challenge to the beginning of the array
      setChallenges([{ ...fullChallengeData, id: Date.now().toString() }, ...challenges]);
    }
    setShowChallengeModal(false);
    setEditingChallenge(null);
  };

  const handleCloseChallengeModal = () => {
    setShowChallengeModal(false);
    setEditingChallenge(null);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordPrompt(false);
  };

  return (
    <div className="min-h-screen bg-[#e5d49d]/90 text-neutral-800 flex flex-col items-center p-4 sm:p-8">
      <header className="my-8 sm:my-12 text-center w-full max-w-7xl">
        <div className="relative flex flex-col items-center sm:flex-row sm:justify-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0e181f] uppercase text-center">
                Student Challenge Viewer
            </h1>
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleToggleEditMode}
                    className="bg-[#ef6140] hover:bg-[#d05030] text-white w-12 h-12 rounded-full shadow-md transition-colors duration-300 flex items-center justify-center"
                    aria-pressed={isEditMode}
                    aria-label={isEditMode ? "Exit challenge management mode" : "Enter challenge management mode"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527c.47-.336 1.06-.336 1.53 0l.772.55c.47.336.682.958.346 1.425l-.39.582c-.276.412-.315.932-.102 1.353.213.42.592.748 1.04.868l.893.232c.542.14.94.61.94 1.152v1.093c0 .542-.398 1.012-.94 1.152l-.893.232c-.448.12-.827.448-1.04.868-.213.42-.174.94.102 1.353l.39.582c.336.47.124 1.09-.346 1.425l-.772.55c-.47.336-1.06.336-1.53 0l-.737-.527c-.35-.25-.807-.272-1.205-.108-.396.166-.71.506-.78.93l-.149.894c-.09.542-.56.94-1.11-.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.205.108l-.737.527c-.47.336-1.06.336-1.53 0l-.772-.55c-.47-.336-.682-.958-.346-1.425l.39-.582c.276-.412.315-.932-.102-1.353-.213-.42-.592-.748-1.04-.868l-.893-.232c-.542-.14-.94-.61-.94-1.152v-1.093c0-.542.398-1.012.94-1.152l.893.232c.448-.12.827-.448 1.04-.868.213-.42.174-.94-.102-1.353l-.39-.582c-.336-.47-.124-1.09.346-1.425l.772.55c.47.336 1.06.336 1.53 0l.737.527c.35.25.807.272 1.205.108.396-.166.71.506.78.93l.149.894Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
            </div>
        </div>
        <p className="mt-3 text-lg sm:text-xl text-neutral-700">
          {isEditMode ? 'You are in management mode.' : ''}
        </p>
        {isEditMode && (
          <div className="mt-6 text-center">
            <button
              onClick={handleAddNewChallenge}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 text-lg"
            >
              + Add New Challenge
            </button>
          </div>
        )}
      </header>

      <main className="w-full max-w-7xl pt-8"> {/* Added pt-8 to main to ensure spacing from header */}
        {challenges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12 justify-items-center align-items-start">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isEditMode={isEditMode}
                onEdit={() => handleEditChallenge(challenge)}
                onRemove={() => handleRemoveChallenge(challenge.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-600 text-xl py-10">
            No challenges available. {isEditMode ? "Click 'Add New Challenge' to create one!" : ""}
          </p>
        )}
      </main>

      {showChallengeModal && editingChallenge && (
        <ChallengeFormModal
          isOpen={showChallengeModal}
          onClose={handleCloseChallengeModal}
          onSave={handleSaveChallenge}
          initialData={editingChallenge}
        />
      )}

      {showPasswordPrompt && (
        <PasswordModal
          isOpen={showPasswordPrompt}
          onClose={handleClosePasswordModal}
          onSubmit={handlePasswordSubmit}
        />
      )}

      <footer className="py-8 mt-12 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Student Challenge Viewer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;