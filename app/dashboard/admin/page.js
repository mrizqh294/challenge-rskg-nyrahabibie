"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import ActionButtons from "../../components/ActionButtons";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Modal from "../../components/Modal";
import { Table, Th, Td, EmptyRow } from "../../components/Table";

const ADMIN_MENUS = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "users", label: "Manajemen User", icon: "👤" },
  { id: "patients", label: "Pasien", icon: "🏥" },
  { id: "visits", label: "Kunjungan", icon: "📋" },
];

const PAGE_TITLES = {
  users: "Manajemen User",
  patients: "Data Pasien",
  visits: "Data Kunjungan",
};

export default function DashboardPage() {
  // ==========================================
  // STATE
  // ==========================================
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({});

  const [users, setUsers] = useState([
    { id: 1, name: "Admin SIMRS", email: "admin@simrs.com", role: "Admin" },
    { id: 2, name: "Dr. Budi", email: "budi@simrs.com", role: "Dokter" },
    { id: 3, name: "Siti", email: "siti@simrs.com", role: "Perawat" },
  ]);

  const [patients, setPatients] = useState([
    { id: 1, medicalRecord: "RM001", name: "Ahmad Fauzan", gender: "Laki-laki", age: 25 },
    { id: 2, medicalRecord: "RM002", name: "Siti Aminah", gender: "Perempuan", age: 31 },
    { id: 3, medicalRecord: "RM003", name: "Budi Santoso", gender: "Laki-laki", age: 42 },
  ]);

  const [visits, setVisits] = useState([
    { id: 1, patient: "Ahmad Fauzan", date: "26 Agustus 2026", doctor: "Dr. Budi", status: "Selesai" },
    { id: 2, patient: "Siti Aminah", date: "26 Agustus 2026", doctor: "Dr. Budi", status: "Menunggu" },
    { id: 3, patient: "Budi Santoso", date: "25 Agustus 2026", doctor: "Dr. Andi", status: "Selesai" },
  ]);

  const getPageTitle = () => PAGE_TITLES[activeMenu] || "Dashboard";

  // ==========================================
  // MODAL HELPERS
  // ==========================================
  const openAddModal = () => {
    setModalType("add");
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (data) => {
    setModalType("edit");
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // CRUD HELPERS
  // ==========================================
  const nextId = (list) => (list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1);

  const upsert = (list, setList) => {
    if (modalType === "add") {
      setList([...list, { ...formData, id: nextId(list) }]);
    } else {
      setList(list.map((item) => (item.id === formData.id ? formData : item)));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeMenu === "users") upsert(users, setUsers);
    if (activeMenu === "patients") upsert(patients, setPatients);
    if (activeMenu === "visits") upsert(visits, setVisits);

    closeModal();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    if (activeMenu === "users") setUsers(users.filter((user) => user.id !== id));
    if (activeMenu === "patients") setPatients(patients.filter((patient) => patient.id !== id));
    if (activeMenu === "visits") setVisits(visits.filter((visit) => visit.id !== id));
  };

  // ==========================================
  // TABLES
  // ==========================================
  const renderUsersTable = () => (
    <Table>
      <thead>
        <tr>
          <Th>No</Th>
          <Th>Nama</Th>
          <Th>Email</Th>
          <Th>Role</Th>
          <Th>Aksi</Th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <EmptyRow colSpan={5} />
        ) : (
          users.map((user, index) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <Td>{index + 1}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Badge>{user.role}</Badge>
              </Td>
              <Td>
                <ActionButtons onEdit={() => openEditModal(user)} onDelete={() => handleDelete(user.id)} />
              </Td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  const renderPatientsTable = () => (
    <Table>
      <thead>
        <tr>
          <Th>No</Th>
          <Th>Rekam Medis</Th>
          <Th>Nama</Th>
          <Th>Jenis Kelamin</Th>
          <Th>Umur</Th>
          <Th>Aksi</Th>
        </tr>
      </thead>
      <tbody>
        {patients.length === 0 ? (
          <EmptyRow colSpan={6} />
        ) : (
          patients.map((patient, index) => (
            <tr key={patient.id} className="border-b hover:bg-gray-50">
              <Td>{index + 1}</Td>
              <Td>{patient.medicalRecord}</Td>
              <Td>{patient.name}</Td>
              <Td>{patient.gender}</Td>
              <Td>{patient.age} tahun</Td>
              <Td>
                <ActionButtons onEdit={() => openEditModal(patient)} onDelete={() => handleDelete(patient.id)} />
              </Td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  const renderVisitsTable = () => (
    <Table>
      <thead>
        <tr>
          <Th>No</Th>
          <Th>Pasien</Th>
          <Th>Tanggal</Th>
          <Th>Dokter</Th>
          <Th>Status</Th>
          <Th>Aksi</Th>
        </tr>
      </thead>
      <tbody>
        {visits.length === 0 ? (
          <EmptyRow colSpan={6} />
        ) : (
          visits.map((visit, index) => (
            <tr key={visit.id} className="border-b hover:bg-gray-50">
              <Td>{index + 1}</Td>
              <Td>{visit.patient}</Td>
              <Td>{visit.date}</Td>
              <Td>{visit.doctor}</Td>
              <Td>
                <Badge type={visit.status === "Selesai" ? "green" : visit.status === "Batal" ? "red" : "yellow"}>
                  {visit.status}
                </Badge>
              </Td>
              <Td>
                <ActionButtons onEdit={() => openEditModal(visit)} onDelete={() => handleDelete(visit.id)} />
              </Td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  const renderTable = () => {
    switch (activeMenu) {
      case "users":
        return renderUsersTable();
      case "patients":
        return renderPatientsTable();
      case "visits":
        return renderVisitsTable();
      default:
        return null;
    }
  };

  // ==========================================
  // MODAL FORM
  // ==========================================
  const renderModalForm = () => {
    if (activeMenu === "users") {
      return (
        <>
          <Input label="Nama" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Masukkan nama" />
          <Input label="Email" name="email" type="email" value={formData.email || ""} onChange={handleChange} placeholder="Masukkan email" />
          <Select label="Role" name="role" value={formData.role || ""} onChange={handleChange}>
            <option value="">Pilih Role</option>
            <option value="Admin">Admin</option>
            <option value="Dokter">Dokter</option>
            <option value="Perawat">Perawat</option>
          </Select>
        </>
      );
    }

    if (activeMenu === "patients") {
      return (
        <>
          <Input label="No. Rekam Medis" name="medicalRecord" value={formData.medicalRecord || ""} onChange={handleChange} placeholder="RM004" />
          <Input label="Nama Pasien" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Masukkan nama pasien" />
          <Select label="Jenis Kelamin" name="gender" value={formData.gender || ""} onChange={handleChange}>
            <option value="">Pilih jenis kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </Select>
          <Input label="Umur" name="age" type="number" value={formData.age || ""} onChange={handleChange} placeholder="Masukkan umur" />
        </>
      );
    }

    if (activeMenu === "visits") {
      return (
        <>
          <Input label="Nama Pasien" name="patient" value={formData.patient || ""} onChange={handleChange} placeholder="Nama pasien" />
          <Input label="Tanggal" name="date" value={formData.date || ""} onChange={handleChange} placeholder="26 Agustus 2026" />
          <Input label="Dokter" name="doctor" value={formData.doctor || ""} onChange={handleChange} placeholder="Nama dokter" />
          <Select label="Status" name="status" value={formData.status || ""} onChange={handleChange}>
            <option value="">Pilih status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Selesai">Selesai</option>
            <option value="Batal">Batal</option>
          </Select>
        </>
      );
    }

    return null;
  };

  // ==========================================
  // RETURN
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={ADMIN_MENUS}
      />

      <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>
        <Header title={getPageTitle()} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="p-4 md:p-6">
          {activeMenu === "dashboard" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Selamat datang di sistem informasi manajemen rumah sakit.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total User" value={users.length} icon="👤" />
                <StatCard title="Total Pasien" value={patients.length} icon="🏥" />
                <StatCard title="Total Kunjungan" value={visits.length} icon="📋" />
              </div>
            </>
          )}

          {activeMenu !== "dashboard" && (
            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
                  <p className="mt-1 text-sm text-gray-500">Kelola data {getPageTitle().toLowerCase()}.</p>
                </div>

                <button
                  onClick={openAddModal}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  + Tambah Data
                </button>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">{renderTable()}</div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        show={showModal}
        title={modalType === "add" ? `Tambah ${getPageTitle()}` : `Edit ${getPageTitle()}`}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        {renderModalForm()}
      </Modal>
    </div>
  );
}
