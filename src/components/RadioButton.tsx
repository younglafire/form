import React from 'react';

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
  children,
  disabled = false,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
      />
      <label
        htmlFor={id}
        className={`text-sm font-medium cursor-pointer ${
          disabled ? 'text-gray-400' : 'text-gray-900 hover:text-blue-600'
        } transition-colors`}
      >
        {children}
      </label>
    </div>
  );
};