
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Sparkles, History, Github, AlertTriangle, Camera } from 'lucide-react';
import { FileData, ExamAnalysisResponse } from './types';
import { analyzeExamFile } from './services/geminiService';
import { ExamResult } from './components/ExamResult';
import { CameraCapture } from './components/CameraCapture';

const App: React.FC = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExamAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Support Images and PDFs
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFile({
        base64,
        mimeType: selectedFile.type,
        name: selectedFile.name
      });
      setError(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Numérisation de l'examen...",
    "Détection des questions mathématiques...",
    "Résolution étape par étape (cela peut prendre 1-2 min pour plus de précision)...",
    "Vérification de la conformité au cadre référentiel...",
    "Formatage des formules LaTeX...",
    "Finalisation du corrigé détaillé..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 5000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleCameraCapture = (base64: string) => {
    setFile({
      base64: base64.split(',')[1],
      mimeType: 'image/jpeg',
      name: `Capture_${new Date().getTime()}.jpg`
    });
    setShowCamera(false);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeExamFile(file);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse du fichier. Veuillez vous assurer que le fichier est clair et approprié.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              BaccAnalyst Morocco
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">À propos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Bac Maroc</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-all flex items-center gap-2">
              Se connecter
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Réussissez votre <span className="text-blue-600">Baccalauréat</span> avec l'IA
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Téléchargez une photo, un PDF ou prenez directement une photo de votre examen pour un corrigé instantané.
            </p>
          </div>
        )}

        {/* Upload Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 mb-12">
          {!result && !loading ? (
            showCamera ? (
              <CameraCapture 
                onCapture={handleCameraCapture} 
                onCancel={() => setShowCamera(false)} 
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label 
                    className={`
                      relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4
                      ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
                    `}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChange} 
                    />
                    
                    <div className="bg-slate-100 p-3 rounded-2xl text-slate-400">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Choisir un fichier</p>
                      <p className="text-xs text-slate-400">PDF, JPG, PNG</p>
                    </div>
                  </label>

                  <button 
                    onClick={() => setShowCamera(true)}
                    className="border-2 border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-4"
                  >
                    <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Prendre une photo</p>
                      <p className="text-xs text-slate-400">Utilisez votre caméra</p>
                    </div>
                  </button>
                </div>

                {file && (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-blue-900 truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                    >
                      Changer
                    </button>
                  </div>
                )}

                {file && (
                  <button 
                    onClick={runAnalysis}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 text-lg"
                  >
                    <Sparkles className="w-6 h-6" />
                    Lancer l'analyse complète
                  </button>
                )}
              </div>
            )
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">{loadingMessages[loadingStep]}</h3>
                <p className="text-slate-500 animate-pulse">
                  Pour obtenir des solutions détaillées ligne par ligne, le temps de réflexion est optimisé.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <History className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700">Analyse terminée</span>
               </div>
               <button 
                onClick={() => {setResult(null); setFile(null);}}
                className="text-blue-600 font-bold hover:underline"
               >
                 Analyser un nouveau fichier
               </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results Component */}
        {result && <ExamResult data={result} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">BaccAnalyst Morocco</span>
            </div>
            <p className="text-slate-500 text-sm">
              Votre compagnon pédagogique pour le Baccalauréat. Nous utilisons l'IA pour fournir des solutions précises et détaillées.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-lg">Liens rapides</h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li><a href="#" className="hover:text-blue-600">Préparation Bac 2024</a></li>
              <li><a href="#" className="hover:text-blue-600">Sujets précédents</a></li>
              <li><a href="#" className="hover:text-blue-600">Cadre Référentiel</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-lg">Contact</h4>
            <div className="flex gap-4">
              <button className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <Github className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              © 2024. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
