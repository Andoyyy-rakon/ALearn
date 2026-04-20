import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { BrainCircuit, Loader2, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
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
      setTopic(location.state.topic || 'PDF Document');
      
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

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
          <BrainCircuit className="w-20 h-20 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-extrabold text-blue-600 mb-6">
            {score} <span className="text-3xl text-slate-400">/ {quizData.length}</span>
          </div>
          <p className="text-lg text-slate-600 mb-8">
            You were quizzed on <span className="font-semibold text-slate-800">{topic}</span>.
          </p>
          <button 
            onClick={() => {
              setQuizData(null);
              setQuizComplete(false);
              setScore(0);
              setCurrentQuestionIndex(0);
              resetQuestionState();
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizData) {
    if (quizData.length === 0) {
      return (
        <div className="max-w-xl mx-auto pt-10 text-center">
          <BrainCircuit className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Quiz Generation Error</h2>
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
            Our AI couldn't generate a quiz for this topic. It might be too vague or unsupported.
          </div>
          <button 
            onClick={() => setQuizData(null)} 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="max-w-xl mx-auto pt-10 text-center">
          <BrainCircuit className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Question Not Found</h2>
          <p className="text-slate-600 mb-6">We couldn't load this specific question. It might be missing formatted data.</p>
          <button 
            onClick={() => setQuizData(null)} 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
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

    const isCorrect = isAnswered && selectedAnswer === correctAns;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Quiz: {topic}</h2>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full font-medium text-sm">
            Question {currentQuestionIndex + 1} of {quizData.length}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-tight">
              {currentQuestion.question || "Unknown Question"}
            </h3>

            <div className="space-y-4">
              {choicesList.map((choice, idx) => {
                let buttonClass = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-lg ";
                
                if (!isAnswered) {
                  if (selectedAnswer === choice) {
                    buttonClass += "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
                  } else {
                    buttonClass += "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
                  }
                } else {
                  if (choice === correctAns) {
                    buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                  } else if (choice === selectedAnswer) {
                    buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300";
                  } else {
                    buttonClass += "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50";
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
                      {isAnswered && choice === correctAns && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                      {isAnswered && choice === selectedAnswer && choice !== correctAns && <XCircle className="w-6 h-6 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col items-center">
            {isAnswered && explanation && !loadingExplanation && (
              <div className="w-full mb-6 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h4 className="flex items-center text-orange-800 dark:text-orange-300 font-semibold mb-2">
                  <BrainCircuit className="w-5 h-5 mr-2" /> AI Explanation
                </h4>
                <p className="text-orange-900 dark:text-orange-200 text-sm leading-relaxed">{explanation}</p>
              </div>
            )}
            
            {loadingExplanation && (
              <div className="w-full mb-6 py-4 flex justify-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating explanation...
              </div>
            )}

            {!isAnswered ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null || selectedAnswer === undefined}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full sm:w-auto px-8 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition flex items-center justify-center"
              >
                {currentQuestionIndex + 1 < quizData.length ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pt-10 text-center px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6">
        <BrainCircuit className="w-10 h-10 sm:w-12 sm:h-12 text-primary-indigo dark:text-indigo-400" />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-on-surface">AI Quiz Mode</h1>
      </div>
      <p className="text-slate-600 dark:text-on-surface/60 mb-8 max-w-md mx-auto">Test your knowledge. Our AI will generate a dynamic multiple choice test on any subject.</p>
      
      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">{error}</div>}

      <form onSubmit={startQuiz} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        <label className="block text-left text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What do you want to be tested on?</label>
        <input
          type="text"
          required
          placeholder="e.g. Philippine History, Math, Science..."
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm mb-6"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <label className="block text-left text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Questions (1-20)</label>
        <input
          type="number"
          min="1"
          max="20"
          required
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm mb-8"
          value={questionCount}
          onChange={(e) => {
            const val = e.target.value;
            setQuestionCount(val === '' ? '' : parseInt(val));
          }}
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-70 transition-all"
        >
          {loading ? <Loader2 className="animate-spin w-6 h-6 mr-3" /> : <PlayCircle className="w-6 h-6 mr-3" />}
          {loading ? 'Generating Quiz...' : 'Start Quiz'}
        </button>
      </form>
    </div>
  );
};

export default Quiz;
