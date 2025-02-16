import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const alertVariants = {
  default: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
  destructive: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
  success: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
  warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
  info: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
};

const alertIconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

export const Alert = ({ 
  children, 
  variant = 'default', 
  className = '', 
  onClose,
  ...props 
}) => {
  const IconComponent = alertIconMap[variant];

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 shadow-sm ${alertVariants[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-4">
        <IconComponent className="h-5 w-5" />
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const AlertTitle = ({ className = '', ...props }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props} />
);

export const AlertDescription = ({ className = '', ...props }) => (
  <div className={`text-sm opacity-90 ${className}`} {...props} />
);

export default Alert;