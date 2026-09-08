import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, Save } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto pt-8 sm:pt-10 pb-16 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-text">Create Flashcard</h1>
        <p className="mt-2 text-muted text-[15px]">Manually add a specific question and answer to your deck.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-panel overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-[12.5px] text-muted mb-2">Question (Front)</label>
            <textarea
              name="question"
              required
              rows="3"
              value={formData.question}
              onChange={handleChange}
              placeholder="What is the use of useEffect?"
              className="field-underline"
            ></textarea>
          </div>

          <div>
            <label className="block text-[12.5px] text-muted mb-2">Answer (Back)</label>
            <textarea
              name="answer"
              required
              rows="4"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Allows you to perform side effects in function components..."
              className="field-underline"
            ></textarea>
          </div>
        </div>

        <div className="bg-white/3 px-6 py-4 flex items-center justify-end border-t border-line">
          <button
            type="submit"
            disabled={loading}
            className="btn-brass text-[14px] px-6 py-2.5"
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
