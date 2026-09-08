import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Loader2 } from 'lucide-react';
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
      toast.success('Flashcards generated successfully! Added to your deck.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6">
      <div className="text-center mb-10 px-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-text tracking-tight">
          Topic Generator
        </h1>
        <p className="mt-4 text-[16px] text-muted max-w-2xl mx-auto">Instantly generate study materials on any subject.</p>
      </div>

      <div className="card-panel overflow-hidden ambient-shadow">
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-rust/10 text-rust border border-rust/20 rounded-[3px]">
              {error}
            </div>
          )}

          <form onSubmit={handleTopicGenerate} className="max-w-xl mx-auto space-y-6">
            <div>
              <label className="block text-[12.5px] text-muted mb-2">Subject or Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. World War II, Machine Learning, Biology..."
                className="w-full px-4 py-3 bg-white/3 border border-line rounded-[3px] text-text text-[15px] focus:border-brass focus:outline-none transition-colors placeholder:text-muted/50"
                value={topicForm.topic}
                onChange={(e) => setTopicForm({ ...topicForm, topic: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-[12.5px] text-muted mb-2">Number of Flashcards</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-full px-4 py-3 bg-white/3 border border-line rounded-[3px] text-text text-[15px] focus:border-brass focus:outline-none transition-colors"
                value={topicForm.count}
                onChange={(e) => setTopicForm({ ...topicForm, count: e.target.value })}
              />
              <p className="mt-2 text-[12px] text-muted">Maximum 20 cards at a time to ensure quality.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brass text-[15px]"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
              {loading ? 'Generating Cards...' : 'Generate Flashcards'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
