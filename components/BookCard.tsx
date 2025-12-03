import React from 'react';
import { Book } from '../types';
import { Star, Clock } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (id: string) => void;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, compact = false }) => {
  return (
    <div 
      onClick={() => onClick(book.id)}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 flex ${compact ? 'flex-row h-28' : 'flex-col h-full'}`}
    >
      <div className={`${compact ? 'w-20' : 'w-full h-48'} relative overflow-hidden bg-gray-200 shrink-0`}>
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {!compact && (
           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center text-xs font-bold shadow-sm">
             <Star size={12} className="text-accent fill-accent mr-1" />
             {book.rating}
           </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <p className="text-xs text-primary font-medium mb-1">{book.category}</p>
          <h3 className="font-display font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
        </div>
        
        <div className="flex items-center mt-2 text-gray-400 text-xs">
          <Clock size={12} className="mr-1" />
          <span>{book.duration} min</span>
        </div>
      </div>
    </div>
  );
};
