
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from '@/context/HistoryContext';
import { createHistoryItem } from '@/utils/calculatorUtils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import CalculatorDisplay from './CalculatorDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScientificCalculatorProps {
  className?: string;
}

// Scientific operations
type ScientificOperation = 
  | 'sin' | 'cos' | 'tan' 
  | 'log' | 'ln' 
  | 'sqrt' | 'square' | 'pow'
  | 'factorial' | 'exp'
  | 'pi' | 'e';

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ className }) => {
  const [display, setDisplay] = useState('0');
  const [previousDisplay, setPreviousDisplay] = useState('');
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  
  const { addHistoryItem } = useHistory();

  const clearAll = () => {
    setDisplay('0');
    setPreviousDisplay('');
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (waitingForOperand) return;
    
    setDisplay(prev => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(prev => prev === '0' ? digit : `${prev}${digit}`);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(prev => `${prev}.`);
    }
  };

  const toggleSign = () => {
    setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : `-${prev}`);
  };

  const performBasicOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);
    
    if (previousDisplay === '') {
      setPreviousDisplay(display);
    } else if (operation) {
      const currentValue = parseFloat(previousDisplay);
      let newValue: number;
      
      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        case 'pow':
          newValue = Math.pow(currentValue, inputValue);
          break;
        default:
          newValue = inputValue;
      }
      
      setPreviousDisplay(String(newValue));
      setDisplay(String(newValue));
    }
    
    setOperation(nextOperation);
    setWaitingForOperand(true);
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const factorial = (num: number): number => {
    if (num < 0) return NaN;
    if (num <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  const performScientificOperation = (op: ScientificOperation) => {
    const inputValue = parseFloat(display);
    let result: number;

    try {
      switch (op) {
        case 'sin':
          result = Math.sin(angleMode === 'deg' ? toRadians(inputValue) : inputValue);
          break;
        case 'cos':
          result = Math.cos(angleMode === 'deg' ? toRadians(inputValue) : inputValue);
          break;
        case 'tan':
          result = Math.tan(angleMode === 'deg' ? toRadians(inputValue) : inputValue);
          break;
        case 'log':
          result = Math.log10(inputValue);
          break;
        case 'ln':
          result = Math.log(inputValue);
          break;
        case 'sqrt':
          result = Math.sqrt(inputValue);
          break;
        case 'square':
          result = Math.pow(inputValue, 2);
          break;
        case 'factorial':
          result = factorial(inputValue);
          break;
        case 'exp':
          result = Math.exp(inputValue);
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          result = inputValue;
      }

      // Save the previous expression for history
      const expression = `${op}(${display})`;
      setDisplay(String(result));
      setWaitingForOperand(true);

      // Add to calculator history
      addHistoryItem(createHistoryItem(expression, String(result)));
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Invalid operation",
        variant: "destructive",
      });
    }
  };

  const calculateResult = () => {
    if (!operation || previousDisplay === '') return;
    
    const currentValue = parseFloat(previousDisplay);
    const inputValue = parseFloat(display);
    let newValue: number;
    
    switch (operation) {
      case '+':
        newValue = currentValue + inputValue;
        break;
      case '-':
        newValue = currentValue - inputValue;
        break;
      case '*':
        newValue = currentValue * inputValue;
        break;
      case '/':
        newValue = currentValue / inputValue;
        break;
      case 'pow':
        newValue = Math.pow(currentValue, inputValue);
        break;
      default:
        newValue = inputValue;
    }
    
    // Create expression string for history
    const expression = `${previousDisplay} ${operation} ${display}`;
    const result = String(newValue);
    
    // Add to calculator history
    addHistoryItem(createHistoryItem(expression, result));
    
    setDisplay(result);
    setPreviousDisplay('');
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let handled = true;

    if ('0123456789'.includes(e.key)) {
      inputDigit(e.key);
    } else if (e.key === '.') {
      inputDecimal();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
      performBasicOperation(e.key);
    } else if (e.key === '=' || e.key === 'Enter') {
      calculateResult();
    } else if (e.key === 'Escape') {
      clearAll();
    } else if (e.key === 'Backspace') {
      backspace();
    } else {
      handled = false;
    }

    if (handled) {
      e.preventDefault();
    }
  }, [display, previousDisplay, operation, waitingForOperand, angleMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const toggleAngleMode = () => {
    setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg');
    toast({
      title: `Angle Mode: ${angleMode === 'deg' ? 'Radians' : 'Degrees'}`,
      duration: 2000,
    });
  };

  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      <div className="col-span-1">
        <CalculatorDisplay 
          value={display} 
          expression={operation ? `${previousDisplay} ${operation}` : ''} 
        />
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-5 gap-2">
          {/* Angle mode toggle */}
          <Button
            variant="outline"
            className="col-span-2 p-2 h-12"
            onClick={toggleAngleMode}
          >
            {angleMode.toUpperCase()}
          </Button>
          
          {/* Clear buttons */}
          <Button
            variant="secondary"
            className="p-2 h-12"
            onClick={clearAll}
          >
            AC
          </Button>
          
          <Button
            variant="secondary"
            className="p-2 h-12"
            onClick={clearEntry}
          >
            CE
          </Button>
          
          <Button
            variant="secondary"
            className="p-2 h-12"
            onClick={backspace}
          >
            ←
          </Button>
          
          {/* Scientific operations */}
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('sin')}
          >
            sin
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('cos')}
          >
            cos
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('tan')}
          >
            tan
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation('pow')}
          >
            x^y
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('square')}
          >
            x²
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('sqrt')}
          >
            √x
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('log')}
          >
            log
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('ln')}
          >
            ln
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('exp')}
          >
            e^x
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('factorial')}
          >
            x!
          </Button>
          
          {/* Constants */}
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('pi')}
          >
            π
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performScientificOperation('e')}
          >
            e
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('7')}
          >
            7
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('8')}
          >
            8
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('9')}
          >
            9
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation('/')}
          >
            ÷
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => toggleSign()}
          >
            ±
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('4')}
          >
            4
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('5')}
          >
            5
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('6')}
          >
            6
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation('*')}
          >
            ×
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation('(')}
          >
            (
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('1')}
          >
            1
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('2')}
          >
            2
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('3')}
          >
            3
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation('-')}
          >
            −
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation(')')}
          >
            )
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => inputDigit('0')}
          >
            0
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={inputDecimal}
          >
            .
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={calculateResult}
          >
            =
          </Button>
          
          <Button
            variant="outline"
            className="p-2 h-12"
            onClick={() => performBasicOperation('+')}
          >
            +
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScientificCalculator;
