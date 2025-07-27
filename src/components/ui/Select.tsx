import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  className?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      disabled = false,
      required = false,
      className = '',
      placeholder = 'Select an option',
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
        <select
          ref={ref}
          disabled={disabled}
          required={required}
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 
            disabled:bg-gray-50 disabled:text-gray-500
            px-3 py-2
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
