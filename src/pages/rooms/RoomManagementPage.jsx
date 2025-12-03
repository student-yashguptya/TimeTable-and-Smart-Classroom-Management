// src/pages/rooms/RoomManagementPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { mockApi } from "../../mock/mockApi";

import RoomHeader from "../../components/rooms/RoomHeader";
import RoomTable from "../../components/rooms/RoomTable";
import RoomModal from "../../components/rooms/modals/RoomModal";

const RoomManagementPage = () => {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*                            LOAD ROOMS                              */
  /* ------------------------------------------------------------------ */

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const r = await mockApi.getRooms();
      setRooms(r);
    } catch (err) {
      console.error(err);
      showToast("Failed to load rooms.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  /* ------------------------------------------------------------------ */
  /*                           AUTH / LOGOUT                            */
  /* ------------------------------------------------------------------ */

  const handleLogout = () => {
    logout();
    showToast("Logged out.", "info");
    navigate("/login", { replace: true });
  };

  /* ------------------------------------------------------------------ */
  /*                       EXCEL IMPORT HELPERS                         */
  /* ------------------------------------------------------------------ */

  const handleExcelButtonClick = () => {
    fileInputRef.current?.click();
  };

  const parseExcelToRooms = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Expected Excel columns: Name | Type | Capacity
          const mapped = json.map((row, index) => ({
            name: row.Name || row.name || `Room ${index + 1}`,
            type: row.Type || row.type || "",
            capacity: Number(row.Capacity || row.capacity || 0),
          }));

          resolve(mapped);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const handleExcelChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const roomsFromExcel = await parseExcelToRooms(file);

      if (!roomsFromExcel.length) {
        showToast("No room rows found in Excel.", "warning");
      } else {
        await mockApi.bulkAddRooms(roomsFromExcel, user?.email || "Admin");
        showToast(
          `Imported ${roomsFromExcel.length} rooms from Excel.`,
          "success"
        );
        loadRooms();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to import rooms from Excel.", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  /* ------------------------------------------------------------------ */
  /*                         DERIVED DATA                               */
  /* ------------------------------------------------------------------ */

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------------------------------------------------------ */
  /*                              RENDER                                */
  /* ------------------------------------------------------------------ */

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            <RoomHeader
              search={search}
              onSearchChange={setSearch}
              isUploading={isUploading}
              onExcelClick={handleExcelButtonClick}
              onAddClick={() => setAddModal(true)}
            />

            {/* Hidden Excel input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleExcelChange}
            />

            <RoomTable
              isLoading={isLoading}
              rooms={filteredRooms}
              onEdit={(room) => setEditModal(room)}
            />
          </div>

          {/* MODALS */}
          {addModal && (
            <RoomModal
              title="Add Room"
              onClose={() => setAddModal(false)}
              onSaved={loadRooms}
              initialData={null}
              currentUserEmail={user?.email}
            />
          )}

          {editModal && (
            <RoomModal
              title="Edit Room"
              initialData={editModal}
              onClose={() => setEditModal(null)}
              onSaved={loadRooms}
              currentUserEmail={user?.email}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagementPage;
