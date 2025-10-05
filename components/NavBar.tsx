
import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import Icon from './Icon';

interface NavBarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="max-w-7xl mx-auto flex justify-around">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${
              selectedCategory.id === category.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
            }`}
          >
            <Icon name={category.icon} className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
