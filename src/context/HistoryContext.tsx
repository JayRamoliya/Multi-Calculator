
import React, { createContext, useContext, useState } from 'react';
import { HistoryItem } from '../utils/calculatorUtils';

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  isHistoryOpen: boolean;
  toggleHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50)); // Keep last 50 calculations
  };
  
  const clearHistory = () => {
    setHistory([]);
  };
  
  const toggleHistory = () => {
    setIsHistoryOpen(prev => !prev);
  };
  
  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, isHistoryOpen, toggleHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
