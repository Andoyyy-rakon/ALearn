import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AIGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [topicForm, setTopicForm] = useState({
    topic: '',
    count: 5
  });

  const handleTopicGenerate = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in first");
    
    setLoading(true);
    setError(null);
    try {
      await api.post('/ai/topic', { ...topicForm, userId: user.id });
      toast.success('AI magic complete! New flashcards added to your deck.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-on-surface tracking-tight flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-indigo dark:text-indigo-400" />
          <span>AI Topic Generator</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-on-surface/60 max-w-2xl mx-auto">Instantly generate high-quality study materials using AI on any subject.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden ambient-shadow">
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleTopicGenerate} className="max-w-xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-on-surface/80 mb-2">Subject or Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. World War II, Machine Learning, Biology..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-on-surface rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm transition-colors"
                value={topicForm.topic}
                onChange={(e) => setTopicForm({ ...topicForm, topic: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-on-surface/80 mb-2">Number of Flashcards</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-on-surface rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                value={topicForm.count}
                onChange={(e) => setTopicForm({ ...topicForm, count: e.target.value })}
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-on-surface/40">Maximum 20 cards at a time to ensure quality.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6 mr-3" /> : <Sparkles className="w-6 h-6 mr-3" />}
              {loading ? 'Generating Magic...' : 'Generate Flashcards'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
