export default function Textarea({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = "", 
  required = false,
  rows = 4, // Default jumlah baris untuk textarea
  ...rest 
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        {...rest}
        className="w-full rounded-lg border text-gray-700 bg-white border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
      />
    </div>
  );
}