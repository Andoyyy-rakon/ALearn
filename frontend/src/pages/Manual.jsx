import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Manual = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in first");

    setLoading(true);
    try {
      await api.post('/flashcards/manual', {
        userId: user.id,
        ...formData
      });
      setFormData({ question: '', answer: '' });
      toast.success('Flashcard added to your deck!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Create Flashcard</h1>
        <p className="mt-2 text-slate-600">Manually add a specific question and answer to your deck.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Removed Topic and Difficulty inputs for streamlined UI */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Question (Front)</label>
            <textarea
              name="question"
              required
              rows="3"
              value={formData.question}
              onChange={handleChange}
              placeholder="What is the use of useEffect?"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Answer (Back)</label>
            <textarea
              name="answer"
              required
              rows="4"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Allows you to perform side effects in function components..."
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            {loading ? 'Saving...' : 'Save Flashcard'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Manual;
