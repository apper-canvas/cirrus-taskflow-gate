import { useState } from 'react';
import { motion } from 'framer-motion';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  required = false,
  options = [],
  as = 'input',
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseInputClasses = 'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 bg-white';
  const inputClasses = `${baseInputClasses} ${
    error 
      ? 'border-error focus:ring-error/50 focus:border-error' 
      : 'border-gray-300 focus:border-primary focus:ring-primary/50'
  } ${className}`;

  const renderInput = () => {
    if (as === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder || `Select ${label?.toLowerCase()}`}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (as === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`${inputClasses} resize-none`}
          rows={3}
          {...props}
        />
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
    );
  };

  return (
    <motion.div
      animate={{
        scale: isFocused ? 1.02 : 1
      }}
      transition={{ duration: 0.15 }}
      className="space-y-1"
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;