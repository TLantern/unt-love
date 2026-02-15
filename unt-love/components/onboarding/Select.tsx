interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
}

export function Select({ label, options, error, required, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-zinc-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...props}
        className={`w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 focus:border-[#E85A50] focus:outline-none focus:ring-1 focus:ring-[#E85A50] ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}