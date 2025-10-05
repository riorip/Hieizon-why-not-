
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
    >
      <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.headline} />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {article.headline}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {article.subheadline}
        </p>
      </div>
    </div>
  );
};

export default ArticleCard;
