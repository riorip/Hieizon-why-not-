import React, { useState } from 'react';
import { Article } from '../types';
import Icon from './Icon';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, isSaved, onToggleSave }) => {
  const [isReaderMode, setIsReaderMode] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.headline,
          text: article.subheadline,
          url: article.sourceUri,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(article.sourceUri);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2 flex-shrink-0">
          <Icon name="back" className="w-6 h-6" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold flex-grow truncate mr-2">{article.headline}</h1>
        <button onClick={() => setIsReaderMode(!isReaderMode)} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ${isReaderMode ? 'text-blue-500 dark:text-blue-400' : ''}`} aria-label="Toggle Reader Mode">
          <Icon name="reader" className="w-6 h-6" />
        </button>
      </div>

      {isReaderMode ? (
        <div className="prose prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mt-8">
          <p>{article.content}</p>
          <a 
            href={article.sourceUri} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-base text-blue-600 dark:text-blue-400 hover:underline not-prose block mt-8"
          >
            Read original from {article.sourceTitle}
          </a>
        </div>
      ) : (
        <>
          <img className="w-full h-64 object-cover rounded-lg mb-4 shadow-lg" src={article.imageUrl} alt={article.headline} />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <button onClick={onToggleSave} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Icon name={isSaved ? 'bookmark' : 'bookmarkOutline'} className={`w-6 h-6 ${isSaved ? 'text-blue-500' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Icon name="share" className="w-6 h-6" />
              </button>
            </div>
            <a 
              href={article.sourceUri} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate ml-4"
            >
              {article.sourceTitle}
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Snapshot</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {article.summaryPoints.map((point, index) => <li key={index}>{point}</li>)}
            </ul>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
            <p>{article.content}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleDetail;