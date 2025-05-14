// Define the calculator operations
export type OperationType = '+' | '-' | '×' | '÷' | '%' | '=' | '';

// Define the history item type
export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

// Function to perform calculation
export const calculate = (
  prevValue: string, 
  currentValue: string, 
  operation: OperationType
): string => {
  // Parse values to numbers
  const prev = parseFloat(prevValue);
  const current = parseFloat(currentValue);
  
  // Check if the values are valid numbers
  if (isNaN(prev) || isNaN(current)) return currentValue;
  
  let result = 0;
  
  // Perform the calculation based on the operation
  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      // Check for division by zero
      if (current === 0) return 'Error';
      result = prev / current;
      break;
    case '%':
      result = prev % current;
      break;
    default:
      return currentValue;
  }
  
  // Handle integer results
  if (Number.isInteger(result)) {
    return result.toString();
  }
  
  // Otherwise return with precision
  return result.toFixed(10).replace(/\.?0+$/, '');
};

// Function to format display value
export const formatDisplayValue = (value: string): string => {
  if (!value) return '0';
  if (value === 'Error') return 'Error';
  
  // Format large numbers with commas
  const [integerPart, decimalPart] = value.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

// Function to create a history item
export const createHistoryItem = (
  expression: string, 
  result: string
): HistoryItem => {
  return {
    id: Date.now().toString(),
    expression,
    result,
    timestamp: new Date(),
  };
};
