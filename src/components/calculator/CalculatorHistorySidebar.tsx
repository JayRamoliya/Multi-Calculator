
import React from 'react';
import { cn } from '@/lib/utils';
import { useHistory } from '@/context/HistoryContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDisplayValue } from '@/utils/calculatorUtils';
import { Trash2 } from 'lucide-react';

interface CalculatorHistorySidebarProps {
  className?: string;
}

const CalculatorHistorySidebar: React.FC<CalculatorHistorySidebarProps> = ({
  className = '',
}) => {
  const { history, clearHistory, isHistoryOpen } = useHistory();
  
  if (!isHistoryOpen) return null;
  
  return (
    <div className={cn('bg-card border-l border-border min-h-full p-4 w-full md:w-80', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">History</h2>
        <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      
      {history.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No history yet</p>
      ) : (
        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id} className="border rounded-md p-3 bg-background">
                <div className="text-sm text-muted-foreground">{item.expression}</div>
                <div className="text-lg font-medium">{formatDisplayValue(item.result)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CalculatorHistorySidebar;
