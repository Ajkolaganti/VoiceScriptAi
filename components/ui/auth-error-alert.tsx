import { AlertCircle, X, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AuthError, isNetworkError, isUserError } from '@/lib/auth-errors';

interface AuthErrorAlertProps {
  error: AuthError | null;
  onDismiss?: () => void;
  className?: string;
}

export function AuthErrorAlert({ error, onDismiss, className = '' }: AuthErrorAlertProps) {
  if (!error) return null;

  const getIcon = () => {
    if (isNetworkError(error.code)) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    if (isUserError(error.code)) {
      return <Info className="h-4 w-4" />;
    }
    return <AlertCircle className="h-4 w-4" />;
  };

  const getVariant = () => {
    if (isNetworkError(error.code)) {
      return 'border-orange-500/50 bg-orange-500/10';
    }
    if (isUserError(error.code)) {
      return 'border-blue-500/50 bg-blue-500/10';
    }
    return 'border-red-500/50 bg-red-500/10';
  };

  const getTextColor = () => {
    if (isNetworkError(error.code)) {
      return 'text-orange-700';
    }
    if (isUserError(error.code)) {
      return 'text-blue-700';
    }
    return 'text-red-700';
  };

  const getIconColor = () => {
    if (isNetworkError(error.code)) {
      return 'text-orange-500';
    }
    if (isUserError(error.code)) {
      return 'text-blue-500';
    }
    return 'text-red-500';
  };

  return (
    <Alert className={`${getVariant()} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`${getIconColor()} mt-0.5`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <AlertDescription className={`${getTextColor()} font-medium`}>
            {error.userFriendlyMessage}
          </AlertDescription>
          {error.action && (
            <p className={`${getTextColor()} text-sm mt-1 opacity-90`}>
              {error.action}
            </p>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className={`${getTextColor()} hover:bg-opacity-20 p-1 h-auto`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
} 