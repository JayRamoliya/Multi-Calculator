
import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  variant?: 'default' | 'operator' | 'equals' | 'clear';
  className?: string;
  span?: number;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  variant = 'default',
  className = '',
  span = 1,
}) => {
  const handleClick = () => {
    onClick(value);
  };
  
  const buttonClass = cn({
    'calculator-button': variant === 'default',
    'calculator-operator': variant === 'operator',
    'calculator-equals': variant === 'equals',
    'calculator-clear': variant === 'clear',
    'col-span-2': span === 2,
    'row-span-2': span === -2, // Negative value indicates row span instead of col span
  }, className);
  
  return (
    <button 
      className={buttonClass}
      onClick={handleClick}
      aria-label={value}
    >
      {value}
    </button>
  );
};

export default CalculatorButton;
