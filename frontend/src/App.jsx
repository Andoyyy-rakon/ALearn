import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Manual from './pages/Manual';
import AIGenerator from './pages/AIGenerator';
import Quiz from './pages/Quiz';
import Selection from './pages/Selection';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-surface font-sans transition-colors duration-200 overflow-x-hidden relative">
          <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/selection" element={<ProtectedRoute><Selection /></ProtectedRoute>} />
            <Route path="/manual" element={<ProtectedRoute><Manual /></ProtectedRoute>} />
            <Route path="/ai-generator" element={<ProtectedRoute><AIGenerator /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
