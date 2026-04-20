import { useState } from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const Flashcard = ({ flashcard, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine border color based on difficulty
  const difficultyColors = {
    easy: 'border-green-200 hover:border-green-300',
    medium: 'border-yellow-200 hover:border-yellow-300',
    hard: 'border-red-200 hover:border-red-300',
  };

  const difficultyBadgeColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div 
      className="relative w-full h-80 group perspective-1000 cursor-pointer"
      onClick={toggleFlip}
    >
        {/* Front */}
        <div 
          className={`absolute w-full h-full bg-white rounded-xl shadow-md border ${difficultyColors[flashcard.difficulty]} p-6 flex flex-col backface-hidden transition-transform duration-500 origin-center`}
          style={{ transform: isFlipped ? 'rotateY(-180deg)' : 'none' }}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {flashcard.topic}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors[flashcard.difficulty]}`}>
              {flashcard.difficulty}
            </span>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <h3 className="text-xl font-semibold text-center text-slate-800 line-clamp-4">
              {flashcard.question}
            </h3>
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-slate-400 font-medium">
            <span>Tap to flip</span>
            <span className="uppercase tracking-tighter">{flashcard.source}</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className={`absolute w-full h-full bg-slate-50 border border-slate-200 rounded-xl shadow-md p-6 flex flex-col backface-hidden transition-transform duration-500 origin-center`}
          style={{ transform: isFlipped ? 'none' : 'rotateY(180deg)' }}
        >
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Answer</span>
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }} 
                className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                title="Delete card"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-lg text-center text-slate-700 overflow-y-auto max-h-40 break-words w-full px-2">
              {flashcard.answer}
            </p>
          </div>
          <div className="mt-4 text-xs text-center text-slate-400">
            Tap to flip back
          </div>
        </div>
      {/* Delete Modal Overlay */}
      {showDeleteModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70 rounded-xl">
          <div className="bg-white p-4 rounded-lg shadow-xl text-center m-4 w-full">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Delete Card?</h4>
            <p className="text-sm text-slate-600 mb-4">Are you sure you want to permanently delete this flashcard?</p>
            <div className="flex justify-between space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(onDelete) onDelete(flashcard._id);
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
