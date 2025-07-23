"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalkthroughContextType {
  isWalkthroughActive: boolean;
  currentStep: number;
  totalSteps: number;
  startWalkthrough: () => void;
  stopWalkthrough: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  isFirstTimeUser: boolean;
  markWalkthroughComplete: () => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
};

interface WalkthroughProviderProps {
  children: React.ReactNode;
  walkthroughKey: string; // Unique key for each walkthrough
}

export const WalkthroughProvider: React.FC<WalkthroughProviderProps> = ({ 
  children, 
  walkthroughKey 
}) => {
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Check if user is first time on component mount
  useEffect(() => {
    const walkthroughCompleted = localStorage.getItem(`walkthrough_${walkthroughKey}_completed`);
    if (!walkthroughCompleted) {
      setIsFirstTimeUser(true);
      // Auto-start walkthrough for first-time users after a short delay
      const timer = setTimeout(() => {
        startWalkthrough();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [walkthroughKey]);

  const startWalkthrough = () => {
    setIsWalkthroughActive(true);
    setCurrentStep(0);
  };

  const stopWalkthrough = () => {
    setIsWalkthroughActive(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const markWalkthroughComplete = () => {
    localStorage.setItem(`walkthrough_${walkthroughKey}_completed`, 'true');
    setIsFirstTimeUser(false);
    stopWalkthrough();
  };

  const value: WalkthroughContextType = {
    isWalkthroughActive,
    currentStep,
    totalSteps: 0, // Will be set by WalkthroughSteps
    startWalkthrough,
    stopWalkthrough,
    nextStep,
    previousStep,
    goToStep,
    isFirstTimeUser,
    markWalkthroughComplete,
  };

  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
}; 