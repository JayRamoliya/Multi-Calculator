
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import { calculate, createHistoryItem, OperationType } from '@/utils/calculatorUtils';
import { useHistory } from '@/context/HistoryContext';
import { Delete } from 'lucide-react';

interface BasicCalculatorProps {
  className?: string;
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState('');
  const [operation, setOperation] = useState<OperationType>('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const { addToHistory } = useHistory();
  
  const clearAll = () => {
    setDisplayValue('0');
    setStoredValue('');
    setOperation('');
    setWaitingForOperand(false);
    setExpression('');
  };
  
  const clearEntry = () => {
    setDisplayValue('0');
  };
  
  const backspace = () => {
    if (waitingForOperand) return;
    
    if (displayValue === '0' || displayValue.length === 1) {
      setDisplayValue('0');
    } else {
      setDisplayValue(prev => prev.slice(0, -1));
    }
  };
  
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(prev => 
        prev === '0' ? digit : prev + digit
      );
    }
  };
  
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    
    if (!displayValue.includes('.')) {
      setDisplayValue(prev => prev + '.');
    }
  };
  
  const toggleSign = () => {
    setDisplayValue(prev => 
      prev.startsWith('-') ? prev.slice(1) : '-' + prev
    );
  };
  
  const inputPercent = () => {
    if (displayValue === '0') return;
    
    const value = parseFloat(displayValue) / 100;
    setDisplayValue(value.toString());
  };
  
  const performOperation = (nextOperation: OperationType) => {
    if (nextOperation === '%') {
      inputPercent();
      return;
    }
    
    // If there's an existing operation, perform it
    if (operation && storedValue && !waitingForOperand) {
      const result = calculate(storedValue, displayValue, operation);
      const fullExpression = `${storedValue} ${operation} ${displayValue}`;
      
      // Store in history if equals was pressed
      if (nextOperation === '=') {
        addToHistory(createHistoryItem(fullExpression, result));
        setExpression(fullExpression + ' = ' + result);
      } else {
        setExpression(`${result} ${nextOperation}`);
      }
      
      setDisplayValue(result);
      setStoredValue(result);
      setOperation(nextOperation === '=' ? '' : nextOperation);
      setWaitingForOperand(true);
    } else {
      // No existing operation, just store the values
      setStoredValue(displayValue);
      setOperation(nextOperation === '=' ? '' : nextOperation);
      setWaitingForOperand(true);
      setExpression(`${displayValue} ${nextOperation === '=' ? '' : nextOperation}`);
    }
  };
  
  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    
    const key = e.key;
    
    if (/\d/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === 'Backspace') {
      backspace();
    } else if (key === 'Escape') {
      clearAll();
    } else if (key === '+') {
      performOperation('+');
    } else if (key === '-') {
      performOperation('-');
    } else if (key === '*' || key === 'x') {
      performOperation('×');
    } else if (key === '/') {
      performOperation('÷');
    } else if (key === '%') {
      performOperation('%');
    } else if (key === '=' || key === 'Enter') {
      performOperation('=');
    }
  }, [displayValue, storedValue, operation, waitingForOperand]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <div className={cn('flex flex-col w-full max-w-md mx-auto bg-card rounded-xl p-4 shadow-lg', className)}>
      <CalculatorDisplay 
        primaryValue={displayValue} 
        secondaryValue={storedValue} 
        operation={operation} 
        className="mb-4"
      />
      
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton value="C" onClick={clearAll} variant="clear" />
        <CalculatorButton value="CE" onClick={clearEntry} variant="clear" />
        <CalculatorButton value="%" onClick={() => performOperation('%')} variant="operator" />
        <CalculatorButton value="÷" onClick={() => performOperation('÷')} variant="operator" />
        
        <CalculatorButton value="7" onClick={() => inputDigit('7')} />
        <CalculatorButton value="8" onClick={() => inputDigit('8')} />
        <CalculatorButton value="9" onClick={() => inputDigit('9')} />
        <CalculatorButton value="×" onClick={() => performOperation('×')} variant="operator" />
        
        <CalculatorButton value="4" onClick={() => inputDigit('4')} />
        <CalculatorButton value="5" onClick={() => inputDigit('5')} />
        <CalculatorButton value="6" onClick={() => inputDigit('6')} />
        <CalculatorButton value="-" onClick={() => performOperation('-')} variant="operator" />
        
        <CalculatorButton value="1" onClick={() => inputDigit('1')} />
        <CalculatorButton value="2" onClick={() => inputDigit('2')} />
        <CalculatorButton value="3" onClick={() => inputDigit('3')} />
        <CalculatorButton value="+" onClick={() => performOperation('+')} variant="operator" />
        
        <CalculatorButton value="+/-" onClick={toggleSign} />
        <CalculatorButton value="0" onClick={() => inputDigit('0')} />
        <CalculatorButton value="." onClick={inputDecimal} />
        <CalculatorButton value="=" onClick={() => performOperation('=')} variant="equals" />
      </div>

      <div className="mt-2 flex justify-center">
        <button 
          className="calculator-button px-3 py-2 flex items-center gap-1" 
          onClick={backspace}
          aria-label="Backspace"
        >
          <Delete className="h-4 w-4" />
          <span>Backspace</span>
        </button>
      </div>
    </div>
  );
};

export default BasicCalculator;
