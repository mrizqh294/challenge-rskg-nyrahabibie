export default function ActionButtons2({ onEdit, onAdd }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onEdit}
        className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
      >
        Edit
      </button>

      <button
        onClick={onAdd}
        className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
      >
        Tambah Kunjungan
      </button>
    </div>
  );
}