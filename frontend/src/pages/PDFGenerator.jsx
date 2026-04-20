import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileUp, Loader2 } from 'lucide-react';
import UploadPDF from '../components/UploadPDF';
import { toast } from 'react-hot-toast';

const PDFGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file, type) => {
    if (!user) return toast.error("Please sign in first");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);
    formData.append('type', type); // 'flashcard' or 'quiz'

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/ai/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        throw new Error('AI processed the file but could not extract any meaningful study items. Please try a different document.');
      }

      if (type === 'quiz') {
        toast.success(`Quiz generated from ${file.name}! Get ready.`);
        navigate('/quiz', { state: { quizData: response.data, topic: file.name } });
      } else {
        toast.success(`Flashcards successfully extracted from ${file.name}.`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to process PDF.');
      setError('Failed to process PDF. Note: Large PDFs may exceed API limits.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="text-center mb-12">
        <FileUp className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">PDF Material Generator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Upload your document and let our AI intelligently extract key concepts. Choose whether to generate Flashcards for studying or a Quiz to test your knowledge immediately.</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg max-w-2xl mx-auto shadow-sm">{error}</div>}

      <div className="max-w-2xl mx-auto">
        <UploadPDF onUpload={handleFileUpload} isLoading={loading} />
      </div>
    </div>
  );
};

export default PDFGenerator;
