"use client";
import { useWalkthrough } from './WalkthroughProvider';
import { motion } from 'framer-motion';

interface WalkthroughButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
}

export const WalkthroughButton: React.FC<WalkthroughButtonProps> = ({ 
  className = '', 
  variant = 'primary' 
}) => {
  const { startWalkthrough, isWalkthroughActive } = useWalkthrough();

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startWalkthrough}
        disabled={isWalkthroughActive}
        className={`p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors ${className}`}
        title="Start Walkthrough"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5 text-white"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" 
          />
        </svg>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={startWalkthrough}
      disabled={isWalkthroughActive}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        variant === 'primary' 
          ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed' 
          : 'bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-500 disabled:cursor-not-allowed'
      } ${className}`}
    >
      {isWalkthroughActive ? 'Walkthrough Active...' : 'Walkthrough'}
    </motion.button>
  );
}; 