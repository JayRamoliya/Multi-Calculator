
import React from 'react';
import { cn } from '@/lib/utils';
import { formatDisplayValue } from '@/utils/calculatorUtils';
import { useToast } from '@/components/ui/use-toast';

interface CalculatorDisplayProps {
  primaryValue: string;
  secondaryValue?: string;
  operation?: string;
  className?: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  primaryValue,
  secondaryValue = '',
  operation = '',
  className = '',
}) => {
  const { toast } = useToast();
  const formattedPrimary = formatDisplayValue(primaryValue);
  
  const copyToClipboard = () => {
    if (formattedPrimary === 'Error') return;
    
    navigator.clipboard.writeText(primaryValue)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `Value ${formattedPrimary} copied to clipboard`,
          duration: 2000,
        });
      })
      .catch(err => {
        console.error('Failed to copy to clipboard', err);
      });
  };
  
  return (
    <div className={cn('calculator-display', className)} onClick={copyToClipboard}>
      <div className="flex flex-col">
        {(secondaryValue || operation) && (
          <div className="text-sm text-muted-foreground text-right">
            {secondaryValue} {operation}
          </div>
        )}
        <div className="text-3xl md:text-4xl font-semibold truncate">
          {formattedPrimary}
        </div>
      </div>
    </div>
  );
};

export default CalculatorDisplay;
