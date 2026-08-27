export default function Modal({
  show,
  title,
  onClose,
  onSubmit,
  children,
  onClick,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 transition hover:text-gray-700"
          >
            ×
          </button>
        </div>


        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >

          {/* CONTENT */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>


          {/* FOOTER */}
          <div className="flex shrink-0 justify-end gap-2 border-t bg-gray-50 px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Simpan
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}