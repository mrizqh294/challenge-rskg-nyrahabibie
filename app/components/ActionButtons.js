export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onEdit}
        className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
      >
        Edit
      </button>

      <button
        onClick={onDelete}
        className="text-sm font-medium text-red-600 transition hover:text-red-800"
      >
        Hapus
      </button>
    </div>
  );
}