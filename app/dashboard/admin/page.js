"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import ActionButtons from "../../components/ActionButtons";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Modal from "../../components/Modal";
import Textarea from "../../components/Textarea";
import { getUsers, addUser, updateUser, deleteUser, doctorList } from "./../../services/user.services";
import { addVisit, deleteVisit, getVisits, updateVisit } from "./../../services/visit.services";
import { addPatient, deletePatient, getPatients, updatePatient } from "./../../services/patient.services";
import { Table, Th, Td, EmptyRow } from "../../components/Table";

const ADMIN_MENUS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Manajemen User"},
  { id: "patients", label: "Pasien"},
  { id: "visits", label: "Kunjungan" },
];

const PAGE_TITLES = {
  users: "Manajemen User",
  patients: "Data Pasien",
  visits: "Data Kunjungan",
};

export default function DashboardPage() {
  // STATE
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({});

  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const [users, patients, visits, doctors] = await Promise.all([
          getUsers(),
          getPatients(),
          getVisits(),
          doctorList(),
        ]);

        setUsers(users);
        setPatients(patients);
        setVisits(visits);
        setDoctors(doctors);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const getPageTitle = () => PAGE_TITLES[activeMenu] || "Dashboard";


  // MODAL HELPERS

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
    const { name, value } = e.target;

    setFormData((prev) => {
      let finalValue = value;
      let extraData = {};

      if (name === "age") {
        finalValue = value === "" ? "" : Number(value);
      }

      if (name === "doctorId") {
        const selectedDoctor = doctors.find((doc) => String(doc.id) === String(value));
        extraData.doctorName = selectedDoctor ? selectedDoctor.name : "";
        finalValue = value === "" ? "" : Number(value);
      }

      if (name === "patientId") {
        const selectedPatient = patients.find((pat) => String(pat.id) === String(value));
        extraData.patientName = selectedPatient ? selectedPatient.name : "";
        finalValue = value === "" ? "" : Number(value);
      }

      return {
        ...prev,
        [name]: finalValue,
        ...extraData,
      };
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      if (activeMenu === "users") {
        if (modalType === "add") {
          const user = await addUser(formData);
          alert(user.message);
        } else if (modalType === "edit") {
          const user = await updateUser(formData.id, formData);
          alert(user.message);
        }

        const data = await getUsers();
        setUsers(data);
      }

      if (activeMenu === "patients") {
        if (modalType === "add") {
          const patient = await addPatient(formData);
          alert(patient.message);
        } else if (modalType === "edit") {
          const patient = await updatePatient(formData.id, formData);
          alert(patient.message);
        }

        const data = await getPatients();
        setPatients(data);
      }

      if (activeMenu === "visits") {
        console.log(formData)
        if (modalType === "add") {
          const visit = await addVisit(formData);
          alert(visit.message)
        } else if (modalType === "edit") {
          const visit = await updateVisit(formData.id, formData);
          alert(visit.message)
        }

        const data = await getVisits();
        setVisits(data);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    if (activeMenu === "users") {
      await deleteUser(id);
      const data = await getUsers();
      setUsers(data);
    }

    if (activeMenu === "patients") {
      await deletePatient(id);
      const data = await getPatients();
      setPatients(data);
    }

    if (activeMenu === "visits") {
      await deleteVisit(id);
      const data = await getVisits();
      setVisits(data);
    }
  };

  // TABLE
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
              <Td>{patient.recordNumber}</Td>
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
          <Th>Dokter</Th>
          <Th>Deskripsi</Th>
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
              <Td>{visit.patient.name}</Td>
              <Td>{visit.doctor.name}</Td>
              <Td>{visit.description}</Td>
              <Td>
                <Badge type={visit.status === "COMPLETED" ? "green" : visit.status === "CANCELED" ? "red" : "yellow"}>
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

  // MODAL FORM
  const renderModalForm = () => {
    if (activeMenu === "users") {
      return (
        <>
          <Input label="Nama" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Masukkan nama" />
          <Input className={modalType === "edit" ? "text-gray-400 bg-gray-100" : ""} label="Email" name="email" type="email" value={formData.email || ""} onChange={handleChange} placeholder="Masukkan email" disabled={modalType === "edit"}/>
          {modalType === "add" && (
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Masukkan Password"
            />
          )}
          <Select label="Role" name="role" value={formData.role || ""} onChange={handleChange}>
            <option value="">Pilih Role</option>
            <option value="ADMIN">Admin</option>
            <option value="DOKTER">Dokter</option>
            <option value="PENDAFTARAN">Pendaftaran</option>
          </Select>
        </>
      );
    }

    if (activeMenu === "patients") {
      return (
        <>
          <Input label="Nama Pasien" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Masukkan nama pasien" />
          <Select label="Jenis Kelamin" name="gender" value={formData.gender || ""} onChange={handleChange}>
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Select>
          <Input label="Umur" name="age" type="number" value={formData.age || ""} onChange={handleChange} placeholder="Masukkan umur" />
        </>
      );
    }

    if (activeMenu === "visits") {
      return (
        <>
          <Select label="No. Rekam Medis" name="patientId" value={formData.patientId || ""} onChange={handleChange}>
            <option value="">Pilih No.Rekam Medis</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.recordNumber}
              </option>
            ))}
          </Select>
          <Select label="Dokter" name="doctorId" value={formData.doctorId || ""} onChange={handleChange}>
            <option value="">Pilih Dokter</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </Select>
          <Select label="Status" name="status" value={formData.status || ""} onChange={handleChange}>
            <option value="WAITING">Menunggu</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELED">Batal</option>
          </Select>
          <Textarea label="Deskrisi" name="description" value={formData.description || ""} onChange={handleChange}/>
        </>
      );
    }

    return null;
  };

  // RETURN
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
                <StatCard title="Total User" value={users.length}/>
                <StatCard title="Total Pasien" value={patients.length}/>
                <StatCard title="Total Kunjungan" value={visits.length} />
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
