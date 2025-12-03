
import React, { useState } from 'react';
import { X, Mic, User, Languages } from 'lucide-react';
import { Language, VoiceGender } from '../types';

interface AudioOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (language: Language, gender: VoiceGender) => void;
  isLoading: boolean;
}

export const AudioOptionsModal: React.FC<AudioOptionsModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.FR);
  const [selectedGender, setSelectedGender] = useState<VoiceGender>('female');

  if (!isOpen) return null;

  const flags: Record<Language, string> = {
    [Language.FR]: '🇫🇷',
    [Language.EN]: '🇬🇧',
    [Language.AR]: '🇩🇿',
    [Language.ES]: '🇪🇸',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mic size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Options de Narration</h2>
          <p className="text-sm text-gray-500">Personnalisez votre expérience audio</p>
        </div>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <Languages size={14} /> Langue
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Language).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                    selectedLanguage === lang 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{flags[lang]}</span>
                  {lang.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Gender Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <User size={14} /> Voix
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedGender('female')}
                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                  selectedGender === 'female' 
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center mb-1">👩</div>
                Femme (Kore)
              </button>
              <button
                onClick={() => setSelectedGender('male')}
                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                  selectedGender === 'male' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                 <div className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center mb-1">👨</div>
                Homme (Fenrir)
              </button>
            </div>
          </div>

          <button
            onClick={() => onGenerate(selectedLanguage, selectedGender)}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Génération...' : 'Générer l\'Audio'}
          </button>
        </div>
      </div>
    </div>
  );
};
