"use client";

import { useState } from "react";

export default function Alert({ title, message, show = false }) {
  const [isOpen, setIsOpen] = useState(show);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800">
              {title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}