import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Brain, Loader2, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Quiz = () => {
  const location = useLocation();
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    if (location.state?.quizData) {
      setTopic(location.state.topic || 'Study Topic');
      
      let data = location.state.quizData;
      if (data && !Array.isArray(data) && Array.isArray(data.items)) {
          data = data.items;
      }
      
      setQuizData(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizComplete(false);
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const startQuiz = async (e) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/quiz', { topic, count: questionCount });
      
      if (!response.data || response.data.length === 0) {
        throw new Error('AI returned an empty quiz. Try a different topic.');
      }
      
      setQuizData(response.data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizComplete(false);
      resetQuestionState();
      toast.success(`Quiz on ${topic} is ready! Good luck.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate quiz.');
      setError('Failed to generate quiz. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setExplanation(null);
  };

  const handleAnswerSelect = (choice) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null || selectedAnswer === undefined) return;
    setIsAnswered(true);

    const currentQuestion = quizData[currentQuestionIndex];
    const correctAns = currentQuestion.correctAnswer || currentQuestion.correct_answer || currentQuestion.answer;
    
    if (selectedAnswer === correctAns) {
      setScore(score + 1);
    } else {
      setLoadingExplanation(true);
      try {
        const response = await api.post('/ai/explain', {
          question: currentQuestion.question,
          correctAnswer: correctAns,
          userAnswer: selectedAnswer
        });
        setExplanation(response.data.explanation);
      } catch (err) {
        console.error('Failed to get explanation', err);
      } finally {
        setLoadingExplanation(false);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestionState();
    } else {
      setQuizComplete(true);
    }
  };

  // ═══ QUIZ COMPLETE ═══
  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="card-panel p-10 ambient-shadow">
          <Brain className="w-20 h-20 text-brass mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-text mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-serif font-medium text-brass mb-6">
            {score} <span className="text-3xl text-muted">/ {quizData.length}</span>
          </div>
          <p className="text-[16px] text-muted mb-8">
            You were quizzed on <span className="font-semibold text-text">{topic}</span>.
          </p>
          <button 
            onClick={() => {
              setQuizData(null);
              setQuizComplete(false);
              setScore(0);
              setCurrentQuestionIndex(0);
              resetQuestionState();
            }}
            className="btn-brass"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // ═══ ACTIVE QUIZ ═══
  if (quizData) {
    if (quizData.length === 0) {
      return (
        <div className="max-w-xl mx-auto pt-10 text-center px-4">
          <Brain className="w-16 h-16 text-rust mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-text mb-4">Quiz Generation Error</h2>
          <div className="mb-6 p-4 bg-rust/10 text-rust border border-rust/20 rounded-[3px]">
            Our AI couldn't generate a quiz for this topic. It might be too vague or unsupported.
          </div>
          <button 
            onClick={() => setQuizData(null)} 
            className="btn-brass"
          >
            Try Again
          </button>
        </div>
      );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="max-w-xl mx-auto pt-10 text-center px-4">
          <Brain className="w-16 h-16 text-brass mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-text mb-4">Question Not Found</h2>
          <p className="text-muted mb-6">We couldn't load this specific question. It might be missing formatted data.</p>
          <button 
            onClick={() => setQuizData(null)} 
            className="btn-brass"
          >
            Go Back
          </button>
        </div>
      );
    }

    let rawChoices = currentQuestion.choices || currentQuestion.options;
    
    if (!rawChoices || (typeof rawChoices === 'object' && Object.keys(rawChoices).length === 0)) {
      const excludeKeys = ['question', 'correctAnswer', 'correct_answer', 'answer', 'explanation', 'difficulty', 'topic'];
      const derived = Object.keys(currentQuestion)
        .filter(k => !excludeKeys.includes(k) && currentQuestion[k] !== null)
        .map(k => currentQuestion[k]);
      rawChoices = derived;
    }
    
    let choicesList = Array.isArray(rawChoices) ? rawChoices : Object.values(rawChoices || {});
    
    if (choicesList.length === 0) {
        choicesList = [JSON.stringify(currentQuestion)];
    }
    const correctAns = currentQuestion.correctAnswer || currentQuestion.correct_answer || currentQuestion.answer;

    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl text-text">Quiz: {topic}</h2>
          <span className="px-3 py-1 card-panel text-brass font-medium text-sm">
            Question {currentQuestionIndex + 1} of {quizData.length}
          </span>
        </div>

        <div className="card-panel overflow-hidden ambient-shadow">
          <div className="p-8">
            <h3 className="font-serif text-2xl text-text mb-8 leading-tight">
              {currentQuestion.question || "Unknown Question"}
            </h3>

            <div className="space-y-3">
              {choicesList.map((choice, idx) => {
                let buttonClass = "w-full text-left px-6 py-4 rounded-[3px] border transition-all font-medium text-[15px] ";
                
                if (!isAnswered) {
                  if (selectedAnswer === choice) {
                    buttonClass += "border-brass bg-brass-soft text-brass";
                  } else {
                    buttonClass += "border-line hover:border-brass/40 hover:bg-white/3 text-text/80";
                  }
                } else {
                  if (choice === correctAns) {
                    buttonClass += "border-sage bg-sage/10 text-sage";
                  } else if (choice === selectedAnswer) {
                    buttonClass += "border-rust bg-rust/10 text-rust";
                  } else {
                    buttonClass += "border-line text-muted/50 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelect(choice)}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{choice}</span>
                      {isAnswered && choice === correctAns && <CheckCircle2 className="w-5 h-5 text-sage" />}
                      {isAnswered && choice === selectedAnswer && choice !== correctAns && <XCircle className="w-5 h-5 text-rust" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/3 border-t border-line p-6 flex flex-col items-center">
            {isAnswered && explanation && !loadingExplanation && (
              <div className="w-full mb-6 p-4 bg-brass-soft border border-brass/20 rounded-[3px]">
                <h4 className="flex items-center text-brass font-semibold mb-2 text-[14px]">
                  <Brain className="w-4 h-4 mr-2" /> AI Explanation
                </h4>
                <p className="text-text/80 text-[13px] leading-relaxed">{explanation}</p>
              </div>
            )}
            
            {loadingExplanation && (
              <div className="w-full mb-6 py-4 flex justify-center text-muted text-[14px]">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating explanation...
              </div>
            )}

            {!isAnswered ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null || selectedAnswer === undefined}
                className="w-full sm:w-auto btn-brass"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full sm:w-auto px-8 py-3 bg-white/5 text-text rounded-[3px] font-semibold text-[15px] hover:bg-white/8 transition-colors flex items-center justify-center border border-line"
              >
                {currentQuestionIndex + 1 < quizData.length ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══ START FORM ═══
  return (
    <div className="max-w-xl mx-auto pt-8 pb-16 px-4 sm:px-6 text-center">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6">
  
        <h1 className="font-serif text-3xl sm:text-4xl text-text">Quiz Generator</h1>
      </div>
      <p className="text-muted text-[15px] mb-8 max-w-md mx-auto">Test your knowledge with a dynamic multiple choice evaluation.</p>
      
      {error && <div className="mb-6 p-4 bg-rust/10 text-rust border border-rust/20 rounded-[3px]">{error}</div>}

      <form onSubmit={startQuiz} className="card-panel p-8 text-left ambient-shadow">
        <label className="block text-[12.5px] text-muted mb-2">What do you want to be tested on?</label>
        <input
          type="text"
          required
          placeholder="e.g. Philippine History, Math, Science..."
          className="w-full px-4 py-3 bg-white/3 border border-line rounded-[3px] text-text text-[15px] focus:border-brass focus:outline-none transition-colors placeholder:text-muted/50 mb-6"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <label className="block text-[12.5px] text-muted mb-2">Number of Questions (1-20)</label>
        <input
          type="number"
          min="1"
          max="20"
          required
          className="w-full px-4 py-3 bg-white/3 border border-line rounded-[3px] text-text text-[15px] focus:border-brass focus:outline-none transition-colors mb-8"
          value={questionCount}
          onChange={(e) => {
            const val = e.target.value;
            setQuestionCount(val === '' ? '' : parseInt(val));
          }}
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-brass text-[15px]"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
          {loading ? 'Generating Quiz...' : 'Start Quiz'}
        </button>
      </form>
    </div>
  );
};

export default Quiz;
