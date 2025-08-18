import { CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function SuccessAlert({ message, onDismiss, className = '' }: SuccessAlertProps) {
  return (
    <Alert className={`border-green-500/50 bg-green-500/10 ${className}`}>
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
        <div className="flex-1">
          <AlertDescription className="text-green-400 font-medium">
            {message}
          </AlertDescription>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-green-400 hover:bg-green-500/20 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
} 