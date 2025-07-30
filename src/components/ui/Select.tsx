import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  containerClassName?: string; // Better naming
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      label,
      placeholder = 'Select an option',
      error,
      disabled = false,
      className = '',
      containerClassName = '', // Separate container classes
      ...rest
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.persist(); // For async operations
      onChange?.(e); // Safe call
    };

    return (
      <div className={`flex flex-col space-y-1 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {rest.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          value={value}
          onChange={handleChange} // Use our handler
          disabled={disabled}
          className={`
            border border-gray-300 rounded-md px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';