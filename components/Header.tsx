
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Horizon
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
