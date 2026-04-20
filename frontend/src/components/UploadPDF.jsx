import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';

const UploadPDF = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [generationType, setGenerationType] = useState('flashcard');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const removeFile = () => setSelectedFile(null);

  const onButtonClick = () => inputRef.current.click();

  const submitFile = () => {
    if (selectedFile) {
      onUpload(selectedFile, generationType);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept="application/pdf"
            onChange={handleChange}
          />
          <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          <h3 className="mb-2 text-lg font-semibold text-slate-700">Upload your material</h3>
          <p className="mb-4 text-sm text-slate-500 text-center">Drag & drop your PDF file here, or click to browse</p>
          <button 
            type="button"
            onClick={onButtonClick}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isLoading && (
              <button onClick={removeFile} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="mb-6 border-t border-slate-100 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-3">Choose Generation Type:</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="genType" 
                  value="flashcard" 
                  checked={generationType === 'flashcard'} 
                  onChange={() => setGenerationType('flashcard')} 
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">📚 Flashcards</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="genType" 
                  value="quiz" 
                  checked={generationType === 'quiz'} 
                  onChange={() => setGenerationType('quiz')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">🧠 Quiz</span>
              </label>
            </div>
          </div>

          <button 
            onClick={submitFile}
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Processing PDF...
              </>
            ) : `Generate ${generationType === 'quiz' ? 'Quiz' : 'Flashcards'}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
