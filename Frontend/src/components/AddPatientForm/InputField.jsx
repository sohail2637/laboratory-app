import React from "react";

export default function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  readOnly = false,
  disabled = false,
}) {
  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
          ${readOnly || disabled ? "cursor-not-allowed opacity-70" : ""}
        `}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
