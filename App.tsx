
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from './context/ThemeContext';
import { fetchNews } from './services/geminiService';
import { Article, Category as CategoryType } from './types';
import { CATEGORIES } from './constants';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import Spinner from './components/Spinner';
import NavBar from './components/NavBar';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const { theme } = useTheme();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savedArticles, setSavedArticles] = useLocalStorage<Article[]>('savedArticles', []);

  const isArticleSaved = useCallback((articleId: string) => {
    return savedArticles.some(a => a.id === articleId);
  }, [savedArticles]);

  const toggleSaveArticle = useCallback((article: Article) => {
    if (isArticleSaved(article.id)) {
      setSavedArticles(prev => prev.filter(a => a.id !== article.id));
    } else {
      setSavedArticles(prev => [...prev, article]);
    }
  }, [isArticleSaved, setSavedArticles]);

  const handleSelectCategory = (category: CategoryType) => {
    if (category.id === 'saved') {
      setSelectedCategory(category);
      setArticles(savedArticles);
      setSelectedArticle(null);
      setIsLoading(false);
      setError(null);
    } else {
      setSelectedArticle(null);
      setSelectedCategory(category);
    }
  };

  const loadNews = useCallback(async () => {
    if (selectedCategory.id === 'saved') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const fetchedArticles = await fetchNews(selectedCategory.name);
      setArticles(fetchedArticles);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch news. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory.id !== 'saved') {
      loadNews();
    } else {
      setArticles(savedArticles);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, savedArticles]); // Dependency on savedArticles to refresh saved list

  const mainContent = useMemo(() => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full pt-20"><Spinner /></div>;
    }

    if (error) {
      return <div className="text-center pt-20 text-red-500 px-4">{error}</div>;
    }
    
    if (selectedCategory.id === 'saved' && articles.length === 0) {
      return <div className="text-center pt-20 text-gray-500 dark:text-gray-400 px-4">You have no saved articles.</div>;
    }

    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
        ))}
      </div>
    );
  }, [isLoading, error, articles, selectedCategory]);

  return (
    <div className={`min-h-screen font-sans text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${theme}`}>
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16 pb-20">
          {selectedArticle ? (
            <ArticleDetail 
              article={selectedArticle} 
              onBack={() => setSelectedArticle(null)}
              isSaved={isArticleSaved(selectedArticle.id)}
              onToggleSave={() => toggleSaveArticle(selectedArticle)}
            />
          ) : (
            mainContent
          )}
        </main>
        <NavBar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
      </div>
    </div>
  );
};

export default App;
