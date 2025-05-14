
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/calculator/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Calculator, Clock } from 'lucide-react';
import { useHistory } from '@/context/HistoryContext';

const Header: React.FC = () => {
  const { toggleHistory, isHistoryOpen } = useHistory();
  
  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Calculator className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold">Multi Calculator</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleHistory}>
            <Clock className="h-4 w-4 mr-2" />
            {isHistoryOpen ? 'Hide History' : 'Show History'}
          </Button>
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="container mx-auto px-4 pb-2">
        <ul className="flex space-x-4 overflow-x-auto">
          <li>
            <Link to="/" className="text-sm font-medium px-3 py-1 rounded-full bg-primary text-primary-foreground">
              Basic
            </Link>
          </li>
          <li>
            <Link to="/scientific" className="text-sm font-medium px-3 py-1 rounded-full hover:bg-secondary">
              Scientific
            </Link>
          </li>
          <li>
            <Link to="/advanced" className="text-sm font-medium px-3 py-1 rounded-full hover:bg-secondary">
              Advanced
            </Link>
          </li>
          <li>
            <Link to="/settings" className="text-sm font-medium px-3 py-1 rounded-full hover:bg-secondary">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
