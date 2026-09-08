import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const Flashcard = ({ flashcard, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  // Difficulty dot colors
  const difficultyDot = {
    easy: 'dot-mastered',
    medium: 'bg-brass',
    hard: 'dot-review',
  };

  const difficultyLabel = {
    easy: 'text-sage',
    medium: 'text-brass',
    hard: 'text-rust',
  };

  return (
    <div 
      className="relative w-full h-80 group perspective-1000 cursor-pointer"
      onClick={toggleFlip}
    >
        {/* Front — Paper Card */}
        <div 
          className="absolute w-full h-full card-paper p-6 flex flex-col backface-hidden transition-transform duration-500 origin-center"
          style={{ transform: isFlipped ? 'rotateY(-180deg)' : 'none' }}
        >
          <div className="flex justify-between items-start mb-4 pb-3 border-b border-line-paper">
            <span className="font-serif text-[15px] text-paper-ink font-medium">{flashcard.topic}</span>
            <span className={`text-[12.5px] font-medium ${difficultyLabel[flashcard.difficulty] || 'text-muted'}`}>
              {flashcard.difficulty}
            </span>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <h3 className="font-serif text-[17px] leading-[1.4] text-center text-paper-ink">
              {flashcard.question}
            </h3>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-line-paper text-[12.5px]">
            <span className="text-[#8a8265]">Tap to flip</span>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-[6px] h-[6px] rounded-full ${difficultyDot[flashcard.difficulty] || 'bg-muted'}`}></span>
              <span className="text-[#5c5747] uppercase tracking-tight text-[11px]">{flashcard.source}</span>
            </div>
          </div>
        </div>

        {/* Back — Panel Card */}
        <div 
          className="absolute w-full h-full card-panel p-6 flex flex-col backface-hidden transition-transform duration-500 origin-center"
          style={{ transform: isFlipped ? 'none' : 'rotateY(180deg)' }}
        >
          <div className="flex justify-between items-start mb-4 pb-3 border-b border-line">
            <span className="text-[12px] font-semibold text-muted uppercase tracking-wide">Answer</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }} 
              className="p-1 text-muted hover:text-rust transition-colors"
              title="Delete card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-[14px] text-center text-text/80 leading-[1.55] overflow-y-auto max-h-40 break-words w-full px-2">
              {flashcard.answer}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-[12px] text-center text-muted">
            Tap to flip back
          </div>
        </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/80 rounded-[3px]">
          <div className="card-panel p-5 text-center m-4 w-full ambient-shadow">
            <h4 className="font-serif text-base font-medium text-text mb-2">Delete Card?</h4>
            <p className="text-[13px] text-muted mb-5">Are you sure you want to permanently delete this flashcard?</p>
            <div className="flex justify-between space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-3 py-2 bg-white/5 text-muted rounded-[3px] font-medium text-[13px] hover:bg-white/8 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(onDelete) onDelete(flashcard._id);
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-3 py-2 bg-rust text-white rounded-[3px] font-medium text-[13px] hover:bg-rust/90 transition-colors"
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
