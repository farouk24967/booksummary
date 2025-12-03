
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { AudioPlayer } from './components/AudioPlayer';
import { PaymentModal } from './components/PaymentModal';
import { AudioOptionsModal } from './components/AudioOptionsModal';
import { MOCK_BOOKS, CATEGORIES, SUBSCRIPTION_PLANS } from './constants';
import { generateBookSummary, summarizePdf, generateSpeech, AIResponse } from './services/geminiService';
import { Language, Book, Category, SubscriptionPlan, VoiceGender } from './types';
import { Play, FileText, Share2, ArrowLeft, CheckCircle2, Sparkles, Loader2, Download, BookOpen, UploadCloud, File, Crown, Check, LogOut, Mic } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- Helper Components ---

const SectionTitle = ({ title, action }: { title: string, action?: string }) => (
  <div className="flex justify-between items-end mb-4 px-4 md:px-0">
    <h3 className="text-lg font-display font-bold text-gray-900">{title}</h3>
    {action && <button className="text-primary text-xs font-bold hover:text-secondary transition-colors">{action}</button>}
  </div>
);

// --- Page Components ---

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth validation
    if (email && password) {
       // In a real app, you would validate credentials against a backend here
       const displayName = name || email.split('@')[0];
       login(email, displayName);
       navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-24">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-100 w-full max-w-md border border-gray-100 animate-fade-in">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
              <BookOpen size={24} />
           </div>
           <h1 className="text-2xl font-display font-bold text-gray-900">{isRegistering ? 'Créer un compte' : 'Bon retour !'}</h1>
           <p className="text-gray-500 text-sm mt-1">{isRegistering ? 'Commencez votre voyage de lecture' : 'Accédez à votre bibliothèque personnelle'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           {isRegistering && (
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom complet</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                 placeholder="John Doe"
               />
             </div>
           )}
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
             <input 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               placeholder="vous@exemple.com"
               required
             />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
             <input 
               type="password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               placeholder="••••••••"
               required
             />
           </div>

           <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 mt-2">
             {isRegistering ? "S'inscrire" : "Se connecter"}
           </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary font-bold ml-1 hover:underline"
            >
              {isRegistering ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const popularBooks = MOCK_BOOKS.filter(b => b.rating >= 4.8);
  const newBooks = MOCK_BOOKS.slice(2, 6);
  const { user } = useAuth();

  return (
    <div className="pb-24 pt-6 md:pt-24 px-4 max-w-4xl mx-auto">
      <header className="mb-8 px-2 md:px-0">
        <h1 className="text-2xl font-display font-bold text-gray-900">Good morning, {user ? user.name.split(' ')[0] : 'Reader'} 👋</h1>
        <p className="text-gray-500">Read smarter, not harder.</p>
      </header>

      {/* Hero/Carousel Area */}
      <div className="mb-10 relative group cursor-pointer" onClick={() => navigate(`/book/${MOCK_BOOKS[0].id}`)}>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-blue-200 overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
             <div className="shrink-0 w-32 shadow-2xl rounded-lg overflow-hidden -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <img src={MOCK_BOOKS[0].coverUrl} alt={MOCK_BOOKS[0].title} className="w-full h-auto" />
             </div>
             <div className="text-center md:text-left">
                <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block border border-white/10">BOOK OF THE DAY</span>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-2 leading-tight">{MOCK_BOOKS[0].title}</h2>
                <p className="text-blue-100 text-sm md:text-base mb-6 line-clamp-2 max-w-md">{MOCK_BOOKS[0].summary}</p>
                <button className="bg-white text-primary hover:bg-blue-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md inline-flex items-center gap-2">
                  <Play size={16} fill="currentColor" /> Listen Now
                </button>
             </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-900/30 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Popular Section */}
      <div className="mb-10">
        <SectionTitle title="Livres populaires" action="See All" />
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-4 px-4 md:px-0 md:mx-0">
          {popularBooks.map(book => (
            <div key={book.id} className="w-40 shrink-0 snap-start">
              <BookCard book={book} onClick={(id) => navigate(`/book/${id}`)} />
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div>
        <SectionTitle title="Nouveautés" />
        <div className="grid gap-4 md:grid-cols-2">
          {newBooks.map(book => (
            <BookCard key={book.id} book={book} onClick={(id) => navigate(`/book/${id}`)} compact />
          ))}
        </div>
      </div>
    </div>
  );
};

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const book = MOCK_BOOKS.find(b => b.id === id);
  const [activeTab, setActiveTab] = useState<'summary' | 'insights'>('summary');
  
  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | undefined>(book?.audioUrl);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Reset audio url when book changes
    setAudioUrl(book?.audioUrl);
    setIsGeneratingAudio(false);
  }, [book]);

  const handleGenerateAudio = async (lang: Language, gender: VoiceGender) => {
    if (!book) return;
    setIsGeneratingAudio(true);
    try {
        const textToRead = book.longSummary || book.summary;
        const url = await generateSpeech(textToRead, lang, gender); 
        if (url) {
            setAudioUrl(url);
            setIsModalOpen(false); // Close modal on success
        }
    } catch (err: any) {
        console.error("Failed to generate audio", err.message || String(err));
        alert("Audio generation failed. Please try again.");
    } finally {
        setIsGeneratingAudio(false);
    }
  };

  if (!book) return <div className="p-8 text-center">Book not found</div>;

  const similarBooks = MOCK_BOOKS.filter(b => b.category === book.category && b.id !== book.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen pb-24 md:pt-20">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/90 backdrop-blur-md z-10 px-4 h-16 flex items-center justify-between border-b border-gray-100 transition-all">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-gray-900 truncate w-48 text-center font-display">{book.title}</span>
        <button className="p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-full">
          <Share2 size={24} />
        </button>
      </div>

      <div className="pt-20 px-4 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="self-center md:self-start shadow-2xl shadow-gray-200 rounded-xl overflow-hidden w-48 md:w-56 shrink-0 transform hover:scale-105 transition-transform duration-500">
                <img src={book.coverUrl} alt={book.title} className="w-full h-auto object-cover" />
            </div>
            <div className="text-center md:text-left flex-1 flex flex-col justify-center">
                <h1 className="text-2xl md:text-4xl font-display font-bold text-gray-900 mb-2 leading-tight">{book.title}</h1>
                <p className="text-lg text-gray-500 font-medium mb-4">{book.author}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium tracking-wide uppercase">{book.category}</span>
                    <span className="px-3 py-1 bg-amber-50 rounded-full text-xs text-amber-700 font-medium flex items-center border border-amber-100">
                        <CheckCircle2 size={12} className="mr-1" /> {book.rating}/5.0
                    </span>
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 font-medium border border-blue-100">{book.duration} mins</span>
                </div>
                
                <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                    <button className="flex-1 md:flex-none bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 transform active:scale-95">
                        <Play size={20} fill="white" /> Listen
                    </button>
                    <button 
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate('/login');
                                return;
                            }
                            setIsModalOpen(true);
                        }}
                        className="flex-1 md:flex-none bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 border border-indigo-100"
                    >
                        <Mic size={20} /> 
                        AI Narration
                    </button>
                </div>
            </div>
        </div>

        {/* Audio Player */}
        {audioUrl && (
            <div className="mb-10 animate-fade-in">
                <AudioPlayer title={book.title} duration={book.duration} url={audioUrl} />
            </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 sticky top-16 md:top-20 bg-white z-10 pt-2">
            <button 
                onClick={() => setActiveTab('summary')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Résumé Détaillé
            </button>
            <button 
                onClick={() => setActiveTab('insights')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'insights' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Points Clés
            </button>
        </div>

        {/* Content */}
        <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed mb-12">
            {activeTab === 'summary' ? (
                <div className="animate-fade-in">
                     <h3 className="font-display font-bold text-gray-900 text-xl mb-4">Résumé du livre</h3>
                     {/* Use longSummary if available, otherwise fallback to summary */}
                    <div className="whitespace-pre-line text-gray-600 text-lg leading-8">
                        {book.longSummary ? book.longSummary : book.summary}
                    </div>
                    
                    {book.fullSummary && (
                        <div className="mt-8 space-y-6">
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wider mb-2">L'idée Principale</h3>
                                <p className="text-blue-800 italic font-medium text-lg">"{book.fullSummary.mainIdea}"</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                 <div className="animate-fade-in">
                    <h3 className="font-display font-bold text-gray-900 text-xl mb-6">Ce que vous allez apprendre</h3>
                    {book.fullSummary ? (
                        <div className="space-y-6">
                             <ul className="space-y-4">
                                {book.fullSummary.keyPoints.map((point, idx) => (
                                    <li key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4 transition-shadow hover:shadow-md">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700 font-medium">{point}</p>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-8">
                                <h3 className="font-display font-bold text-gray-900 text-xl mb-4">Leçons Pratiques</h3>
                                <ul className="space-y-3">
                                    {book.fullSummary.lessons.map((l, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                            <span className="text-gray-700 font-medium">{l}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p>Insights loading...</p>
                    )}
                </div>
            )}
        </div>

        {/* Similar Books */}
        {similarBooks.length > 0 && (
             <div className="border-t border-gray-100 pt-8 mb-8">
                <SectionTitle title="Livres similaires" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {similarBooks.map(b => (
                        <BookCard key={b.id} book={b} onClick={(id) => navigate(`/book/${id}`)} compact={false} />
                    ))}
                </div>
             </div>
        )}
      </div>

      <AudioOptionsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerateAudio}
        isLoading={isGeneratingAudio}
      />
    </div>
  );
};

const ExplorePage = () => {
    const navigate = useNavigate();
    return (
        <div className="pb-24 pt-6 md:pt-24 px-4 max-w-4xl mx-auto">
             <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Explorer par Catégorie</h1>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                 {CATEGORIES.map(cat => (
                     <div key={cat} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                         </div>
                         <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base">{cat}</h3>
                         <p className="text-xs text-gray-500 mt-1">20+ Livres</p>
                     </div>
                 ))}
             </div>

             <SectionTitle title="Tous les livres" />
             <div className="grid gap-4 md:grid-cols-2">
                 {MOCK_BOOKS.map(book => (
                     <BookCard key={book.id} book={book} onClick={(id) => navigate(`/book/${id}`)} compact />
                 ))}
             </div>
        </div>
    );
};

const AIPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [mode, setMode] = useState<'text' | 'pdf'>('text');
    
    // Text Mode State
    const [query, setQuery] = useState('');
    const [author, setAuthor] = useState('');
    
    // PDF Mode State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfSummary, setPdfSummary] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Audio State
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Shared State
    const [language, setLanguage] = useState<Language>(Language.FR);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AIResponse | null>(null);

    const handleGenerateText = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!query) return;
        setIsLoading(true);
        setResult(null);
        setGeneratedAudioUrl(null);
        try {
            const data = await generateBookSummary(query, author || 'Unknown', language);
            setResult(data);
        } catch (err: any) {
            console.error("Generate text error:", err.message || String(err));
            alert('Failed to generate summary. Please check configuration.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setPdfSummary(null); // Reset previous summary
            setGeneratedAudioUrl(null);
        } else {
            alert('Please select a valid PDF file.');
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
                const base64Content = base64String.split(',')[1];
                resolve(base64Content);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleGeneratePdf = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!selectedFile) return;
        setIsLoading(true);
        setPdfSummary(null);
        setGeneratedAudioUrl(null);
        try {
            const base64Data = await fileToBase64(selectedFile);
            const summary = await summarizePdf(base64Data, 'application/pdf', language);
            setPdfSummary(summary);
        } catch (err: any) {
            console.error("PDF generation error:", err.message || String(err));
            alert('Failed to summarize PDF. It might be too large or encrypted.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSpeechFromSummary = async (lang: Language, gender: VoiceGender) => {
        const text = mode === 'text' && result ? result.mainIdea + ". " + result.keyPoints.join(". ") : pdfSummary;
        if (!text) return;

        setIsGeneratingAudio(true);
        try {
            const url = await generateSpeech(text, lang, gender);
            if (url) {
                setGeneratedAudioUrl(url);
                setIsModalOpen(false);
            }
        } catch (err: any) {
            console.error("Speech generation error:", err.message || String(err));
            alert('Failed to generate speech.');
        } finally {
            setIsGeneratingAudio(false);
        }
    }

    const flags: Record<Language, string> = {
        [Language.FR]: '🇫🇷',
        [Language.EN]: '🇬🇧',
        [Language.AR]: '🇩🇿',
        [Language.ES]: '🇪🇸',
    };

    return (
        <div className="pb-24 pt-6 md:pt-24 px-4 max-w-2xl mx-auto">
             <div className="text-center mb-8">
                 <div className="bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                    <Sparkles size={32} className="text-white" />
                 </div>
                 <h1 className="text-2xl font-display font-bold text-gray-900">AI Book Architect</h1>
                 <p className="text-gray-500">Créez un résumé structuré ou analysez vos documents.</p>
             </div>

             {/* Mode Toggle */}
             <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
                 <button 
                    onClick={() => setMode('text')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'text' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                    <BookOpen size={16} /> Par Titre
                 </button>
                 <button 
                    onClick={() => setMode('pdf')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'pdf' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                    <File size={16} /> Par PDF
                 </button>
             </div>

             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 mb-8">
                 <div className="space-y-5">
                     
                     {mode === 'text' ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Titre du livre</label>
                                <input 
                                    type="text" 
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white font-medium"
                                    placeholder="ex: Père Riche Père Pauvre"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Auteur (Optionnel)</label>
                                <input 
                                    type="text" 
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white font-medium"
                                    placeholder="ex: Robert Kiyosaki"
                                />
                            </div>
                        </>
                     ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload PDF</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile ? 'border-primary bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                <input 
                                    type="file" 
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {selectedFile ? (
                                    <>
                                        <FileText size={48} className="text-primary mb-2" />
                                        <p className="font-bold text-gray-900">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <p className="text-xs text-primary font-bold mt-2">Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud size={48} className="text-gray-400 mb-2" />
                                        <p className="font-bold text-gray-500">Click to upload PDF</p>
                                        <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                     )}

                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Langue de sortie (Texte)</label>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {Object.values(Language).map((lang) => (
                                <button 
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-3 py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${language === lang ? 'bg-primary text-white border-primary shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <span className="text-lg">{flags[lang]}</span>
                                    {lang.split(' ')[0]} 
                                </button>
                            ))}
                         </div>
                     </div>
                     
                     <button 
                        onClick={mode === 'text' ? handleGenerateText : handleGeneratePdf}
                        disabled={isLoading || (mode === 'text' ? !query : !selectedFile)}
                        className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-gray-200 transform active:scale-95"
                     >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" size={18} />}
                        {mode === 'text' ? 'Générer le Résumé' : 'Résumer le PDF (600 mots)'}
                     </button>
                 </div>
             </div>

             {/* Audio Player if generated */}
             {generatedAudioUrl && (
                <div className="mb-8 animate-fade-in">
                    <AudioPlayer title="AI Generated Summary" url={generatedAudioUrl} duration={5} />
                </div>
             )}

             {/* RESULT: TEXT MODE */}
             {mode === 'text' && result && (
                 <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-end">
                         <button 
                            onClick={() => {
                                if (!isAuthenticated) {
                                    navigate('/login');
                                    return;
                                }
                                setIsModalOpen(true);
                            }}
                            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold flex items-center text-sm gap-2 hover:bg-indigo-100"
                         >
                            <Mic size={16} />
                            Listen to this Summary
                         </button>
                     </div>

                     <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden text-center">
                        <div className="relative z-10">
                            <Sparkles size={32} className="mx-auto text-accent mb-4" />
                            <p className="text-xl md:text-2xl font-serif italic mb-6 leading-relaxed">"{result.quote}"</p>
                            <div className="h-1 w-16 bg-accent rounded-full mx-auto"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                     </div>

                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="p-2 bg-blue-100 rounded-lg text-primary"><BookOpen size={20} /></div>
                             <h3 className="font-display font-bold text-gray-900 text-lg">Idée Principale</h3>
                         </div>
                         <p className="text-gray-600 leading-relaxed text-lg">{result.mainIdea}</p>
                     </div>

                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center gap-3 mb-6">
                             <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><FileText size={20} /></div>
                             <h3 className="font-display font-bold text-gray-900 text-lg">Points Clés</h3>
                         </div>
                         <ul className="space-y-4">
                             {result.keyPoints.map((point, i) => (
                                 <li key={i} className="flex gap-4">
                                     <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i+1}</div>
                                     <p className="text-gray-700 leading-relaxed">{point}</p>
                                 </li>
                             ))}
                         </ul>
                     </div>

                     <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
                         <div className="flex items-center gap-3 mb-6">
                             <div className="p-2 bg-amber-100 rounded-lg text-amber-700"><CheckCircle2 size={20} /></div>
                             <h3 className="font-display font-bold text-amber-900 text-lg">Leçons à retenir</h3>
                         </div>
                         <ul className="space-y-3">
                             {result.lessons.map((lesson, i) => (
                                 <li key={i} className="flex items-start gap-3 text-amber-900">
                                     <CheckCircle2 size={18} className="shrink-0 mt-1 text-amber-600" />
                                     <span className="leading-relaxed">{lesson}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
             )}

             {/* RESULT: PDF MODE */}
             {mode === 'pdf' && pdfSummary && (
                 <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-end">
                         <button 
                            onClick={() => {
                                if (!isAuthenticated) {
                                    navigate('/login');
                                    return;
                                }
                                setIsModalOpen(true);
                            }}
                            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold flex items-center text-sm gap-2 hover:bg-indigo-100"
                         >
                            <Mic size={16} />
                            Listen to this Summary
                         </button>
                     </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center gap-3 mb-6">
                             <div className="p-2 bg-green-100 rounded-lg text-green-600"><FileText size={20} /></div>
                             <h3 className="font-display font-bold text-gray-900 text-lg">Résumé du Document</h3>
                         </div>
                         {/* Use whitespace-pre-wrap to respect newlines from markdown response */}
                         <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                             {pdfSummary}
                         </div>
                     </div>
                 </div>
             )}

             <AudioOptionsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={handleGenerateSpeechFromSummary}
                isLoading={isGeneratingAudio}
             />
        </div>
    );
};

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  return (
    <div className="pb-24 pt-6 md:pt-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Investissez en vous-même</h1>
        <p className="text-xl text-gray-500">Choisissez le plan qui correspond à vos ambitions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id} className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${plan.recommended ? 'ring-4 ring-primary/20 shadow-2xl scale-105' : 'border border-gray-100 shadow-lg hover:shadow-xl'}`}>
            {plan.recommended && (
              <div className="bg-gradient-to-r from-primary to-secondary text-white text-center text-xs font-bold py-1 uppercase tracking-wider">Recommandé</div>
            )}
            <div className={`p-8 ${plan.color}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-display font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-600 ml-1 font-medium">DA {plan.price > 0 && (plan.period === 'month' ? '/mois' : '/an')}</span>
              </div>
              <button 
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-3 rounded-xl font-bold transition-transform active:scale-95 ${plan.price === 0 ? 'bg-white text-gray-900 border border-gray-200' : 'bg-gray-900 text-white shadow-lg shadow-gray-300'}`}
              >
                {plan.price === 0 ? 'Plan Actuel' : 'Choisir'}
              </button>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {/* Payment Modal */}
      {selectedPlan && selectedPlan.price > 0 && (
        <PaymentModal 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          onSuccess={() => {
            setSelectedPlan(null);
            // In a real app, update global state here
          }}
        />
      )}
    </div>
  );
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    
    // Protect the route
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    return (
        <div className="pb-24 pt-6 md:pt-24 px-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Mon Profil</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 mb-6 relative overflow-hidden">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl text-white font-bold shadow-lg uppercase">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.isPremium ? 'Membre Premium' : 'Membre Gratuit'}
                    </span>
                </div>
                <button className="ml-auto text-primary text-sm font-bold bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors hidden md:block">Éditer</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><FileText size={20} /></div>
                        <span className="font-bold text-gray-700">Mes résumés</span>
                    </div>
                    <span className="bg-gray-100 text-xs font-bold px-2.5 py-1 rounded-full text-gray-600">12</span>
                </div>
                <div className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Download size={20} /></div>
                        <span className="font-bold text-gray-700">Téléchargements</span>
                    </div>
                    <span className="bg-gray-100 text-xs font-bold px-2.5 py-1 rounded-full text-gray-600">3</span>
                </div>
                <div 
                    onClick={() => navigate('/premium')}
                    className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Crown size={20} /></div>
                        <span className="font-bold text-amber-700">Passer Premium</span>
                    </div>
                    <ArrowLeft size={18} className="rotate-180 text-amber-400" />
                </div>
            </div>

            <button 
                onClick={() => {
                    logout();
                    navigate('/login');
                }}
                className="w-full mt-6 p-4 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
                <LogOut size={20} /> Se déconnecter
            </button>
            
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">Version 2.1.0 • BookSummary Inc.</p>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
