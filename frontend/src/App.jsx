import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Manual from './pages/Manual';
import AIGenerator from './pages/AIGenerator';
import Quiz from './pages/Quiz';
import Selection from './pages/Selection';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingOverlay from './components/LoadingOverlay';
import { useAuth } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const { isLoading } = useAuth();
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-ink text-text font-sans overflow-x-hidden relative">
          <Toaster position="top-center" reverseOrder={false} />
          {isLoading && <LoadingOverlay />}
          <Navbar />
          <main className="w-full pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/selection" element={<ProtectedRoute><Selection /></ProtectedRoute>} />
              <Route path="/manual" element={<ProtectedRoute><Manual /></ProtectedRoute>} />
              <Route path="/ai-generator" element={<ProtectedRoute><AIGenerator /></ProtectedRoute>} />
              <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
