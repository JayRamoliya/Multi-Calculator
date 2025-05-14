
import React from 'react';
import Header from './Header';
import CalculatorHistorySidebar from '@/components/calculator/CalculatorHistorySidebar';
import { useHistory } from '@/context/HistoryContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isHistoryOpen } = useHistory();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex">
        <div className={`flex-1 p-4 ${isHistoryOpen ? 'hidden md:block' : ''}`}>
          {children}
        </div>
        <CalculatorHistorySidebar />
      </main>
    </div>
  );
};

export default MainLayout;
