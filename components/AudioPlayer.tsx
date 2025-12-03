

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Loader2, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  title: string;
  duration?: number; // Display duration in minutes from book data
  url?: string;      // Real audio URL
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, duration: bookDuration, url }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when URL changes
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setError(null);
    if (audioRef.current && url) {
        setIsLoading(true);
        audioRef.current.load();
    }
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current || !url || error) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
            setIsPlaying(true);
            setError(null);
          })
          .catch(err => {
            // Avoid logging the full error object if it's complex, just log the message
            console.error("Audio playback error:", err.message || String(err));
            setIsLoading(false);
            setIsPlaying(false);
            setError("Playback failed");
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const curr = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(curr);
      if (dur > 0 && !isNaN(dur)) {
        setDuration(dur);
        setProgress((curr / dur) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current && duration > 0) {
      const newTime = (val / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(val);
      setCurrentTime(newTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleLoadedMetadata = () => {
      if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setIsLoading(false);
          setError(null);
      }
  }
  
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      // Do not log 'e' directly to avoid circular structure errors
      // Use audioRef.current.error to get more details if available
      if (audioRef.current && audioRef.current.error) {
          const err = audioRef.current.error;
          console.error(`Audio Error: Code ${err.code}, Message: ${err.message}`);
      } else {
          console.error("Audio failed to load (Unknown error)");
      }
      setIsLoading(false);
      setIsPlaying(false);
      setError("Audio unavailable");
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 relative overflow-hidden">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        crossOrigin="anonymous"
      />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-xs text-primary uppercase tracking-wider font-bold mb-1">Now Playing</p>
          <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">
             {error ? <span className="text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {error}</span> : `Audio Summary • ${bookDuration} mins read`}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
             <Volume2 size={18} />
        </div>
      </div>

      <div className="mb-2 relative z-10">
        <div className={`relative w-full h-1.5 rounded-full ${error ? 'bg-red-50' : 'bg-gray-100'}`}>
            <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-100 ${error ? 'bg-red-300' : 'bg-primary'}`} 
                style={{ width: `${progress}%` }}
            ></div>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={handleSeek}
                disabled={!!error || !url}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
        </div>
        <div className="flex justify-between text-[10px] font-medium text-gray-400 mt-2 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : (bookDuration ? `${bookDuration}:00` : "--:--")}</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8 relative z-10">
        <button 
            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            onClick={() => {
                if(audioRef.current) audioRef.current.currentTime -= 15;
            }}
            disabled={!!error}
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          disabled={!url || !!error}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 transition-all transform active:scale-95 ${(!url || error) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-secondary'}`}
        >
          {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
          ) : isPlaying ? (
              <Pause size={24} fill="white" />
          ) : (
              <Play size={24} fill="white" className="ml-1" />
          )}
        </button>
        
        <button 
            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            onClick={() => {
                if(audioRef.current) audioRef.current.currentTime += 15;
            }}
            disabled={!!error}
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
    </div>
  );
};