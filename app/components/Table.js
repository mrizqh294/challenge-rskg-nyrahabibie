export function Table({ children }) {
  return (
    <table className="w-full min-w-[700px] text-left text-sm">
      {children}
    </table>
  );
}

export function Th({ children }) {
  return (
    <th className="bg-gray-50 px-6 py-4 font-semibold text-gray-600">
      {children}
    </th>
  );
}

export function Td({ children }) {
  return (
    <td className="px-6 py-4 text-gray-700">
      {children}
    </td>
  );
}

export function EmptyRow({ colSpan }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-6 py-10 text-center text-sm text-gray-500"
      >
        Belum ada data.
      </td>
    </tr>
  );
}