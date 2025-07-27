import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
      placeholder,
      error,
      icon: Icon,
      disabled = false,
      required = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`
              block w-full rounded-lg border-gray-300 shadow-sm 
              focus:border-indigo-500 focus:ring-indigo-500 
              disabled:bg-gray-50 disabled:text-gray-500
              ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            `}
            {...rest}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
