export default function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  );
}