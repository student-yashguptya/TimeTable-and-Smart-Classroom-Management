// src/components/rooms/RoomTable.jsx
import React from "react";
import Spinner from "../ui/Spinner";

const RoomTable = ({ isLoading, rooms, onEdit }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="40" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-black/20">
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Capacity</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <Td>{room.name}</Td>
                <Td muted>{room.type}</Td>
                <Td muted>{room.capacity}</Td>
                <Td>
                  <div className="flex gap-2">
                    <Btn
                      label="Edit"
                      type="blue"
                      onClick={() => onEdit(room)}
                    />
                  </div>
                </Td>
              </tr>
            ))}

            {rooms.length === 0 && (
              <tr>
                <Td colSpan={4} muted>
                  No rooms found.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* small table components */

const Th = ({ children }) => (
  <th className="p-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-[#92a4c9]">
    {children}
  </th>
);

const Td = ({ children, muted, colSpan }) => (
  <td
    colSpan={colSpan}
    className={`p-4 text-xs md:text-sm ${
      muted ? "text-gray-500 dark:text-[#92a4c9]" : "text-gray-800 dark:text-white"
    }`}
  >
    {children}
  </td>
);

const Btn = ({ label, onClick, type }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    default: "bg-primary/10 text-primary hover:bg-primary/20",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-lg ${colors[type] || colors.default}`}
    >
      {label}
    </button>
  );
};

export default RoomTable;
