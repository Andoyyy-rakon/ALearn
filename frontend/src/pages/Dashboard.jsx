import { useState, useEffect } from 'react';
import api from '../services/api';
import Flashcard from '../components/Flashcard';
import { useAuth } from '../context/AuthContext';
import { Layers, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        if (!user?.id) return;
        const response = await api.get(`/flashcards/${user.id}`);
        setFlashcards(response.data);
      } catch (err) {
        setError('Failed to fetch flashcards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/flashcards/${id}`);
      setFlashcards(flashcards.filter(card => card._id !== id));
    } catch (err) {
      console.error('Failed to delete flashcard', err);
      alert('Failed to delete flashcard');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Study Deck</h1>
          <p className="mt-2 text-slate-600">Review your existing flashcards and track progress.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <Layers className="text-blue-500 w-5 h-5" />
          <span className="font-semibold text-slate-800">{flashcards.length} Total</span>
        </div>
      </div>

      {flashcards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <Layers className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">No flashcards yet</h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">Get started by creating some manual flashcards or using the AI generator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flashcards.map((card) => (
            <Flashcard key={card._id} flashcard={card} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
