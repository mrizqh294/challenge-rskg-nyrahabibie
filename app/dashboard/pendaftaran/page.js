"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import ActionButtons2 from "../../components/ActionButtons2";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Modal from "../../components/Modal";
import Textarea from "../../components/Textarea";
import { doctorList } from "./../../services/user.services";
import { addVisit, getVisits, getVisitsByRecepsionist, updateVisit } from "./../../services/visit.services";
import { addPatientVisit, getPatients, updatePatient } from "./../../services/patient.services";
import { Table, Th, Td, EmptyRow } from "../../components/Table";

const ADMIN_MENUS = [
  { id: "dashboard", label: "Dashboard"},
  { id: "regist", label: "Pendaftaran"},
  { id: "visits", label: "Riwayat Kunjungan"},
];

const PAGE_TITLES = {
  regist : "Pendaftaran Kunjungan",
  visits: "Data Kunjungan",
  patientVisit : "Kunjungan",
  patients : "Data Pasien"
};

export default function ReceptionistPage() {
  // STATE
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({});
  const [mode, setMode] = useState("nomode");

  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const [patients, visits, doctors] = await Promise.all([
          getPatients(),
          getVisitsByRecepsionist(),
          doctorList(),
        ]);

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

  const getPageTitle = (activeMenu, mode) => {
    if (mode === "nomode") {
        return PAGE_TITLES[activeMenu];
    } else if (mode === "editPatient") {
        return PAGE_TITLES["patients"];
    } else if (mode === "addVisit") {
        return PAGE_TITLES["patientVisit"];
    }

    return "";
  };


  // MODAL HELPERS

  const openAddModal = () => {
    setModalType("add");
    setFormData({});
    setShowModal(true);
  };

  const openAddVisit = (data) => {
    setModalType("add");
    setMode("addVisit")
    setFormData(data);
    setShowModal(true);
  }

  const openEditPatient = (data) => {
    setModalType("edit");
    setMode("editPatient")
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMode("nomode");
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
      if (activeMenu === "regist") {
        if (modalType === "add" && mode === "nomode") {
          const patientVisit = await addPatientVisit(formData);
          alert(patientVisit.message);
        } else if (modalType === "add" && mode === "addVisit"){
          const visit = await addVisit(formData);
          alert(visit.message);
        } else if (modalType === "edit" && mode === "editPatient") {
          const patient = await updatePatient(formData.id, formData);
          alert(patient.message);
        }

        const patientData = await getPatients();
        const visitData = await getVisits();
        setPatients(patientData);
        setVisits(visitData);
      }

      if (activeMenu === "visits") {
        console.log(formData)
        if (modalType === "add") {
          await addVisit(formData);
        } else if (modalType === "edit") {
          await updateVisit(formData.id, formData);
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

  // TABLE
 
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
                <ActionButtons2 onEdit={() => openEditPatient(patient)} onAdd={() => openAddVisit({patientId : patient.id, name : patient.name, recordNumber : patient.recordNumber})} />
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
          <Th>Pendaftaran</Th>
          <Th>Deskripsi</Th>
          <Th>Status</Th>
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
              <Td>{visit.recepsionist.name}</Td>
              <Td>{visit.description}</Td>
              <Td>
                <Badge type={visit.status === "COMPLETED" ? "green" : visit.status === "CANCELED" ? "red" : "yellow"}>
                  {visit.status}
                </Badge>
              </Td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  const renderTable = () => {
    switch (activeMenu) {
      case "regist":
        return renderPatientsTable();
      case "visits":
        return renderVisitsTable();
      default:
        return null;
    }
  };

  // MODAL FORM

  const renderModalForm = () => {
    
    if (activeMenu === "regist" && mode === "nomode") {
      return (
        <>
          <Input label="Nama Pasien" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Masukkan nama pasien" />
          <Select label="Jenis Kelamin" name="gender" value={formData.gender || ""} onChange={handleChange}>
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Select>
          <Input label="Umur" name="age" type="number" value={formData.age || ""} onChange={handleChange} placeholder="Masukkan umur" />
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
            <option value="CANCEL">Batal</option>
          </Select>
          <Textarea label="Deskripsi" name="description" value={formData.description || ""} onChange={handleChange}/>
        </>
      );
    }

    if (activeMenu === "regist" && mode === "editPatient") {
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



    if (activeMenu === "regist" && mode === "addVisit") {
      return (
        <>
          <Input name="patientId" onChange={handleChange} value={formData.patientId} hidden={true}/>
          <Input label="Nama Pasien" name="name" readOnly={true} placeholder={formData.name} disabled={true}/>
          <Input label="No. Rekam Medis" name="recordNumber" readOnly={true} placeholder={formData.recordNumber || ""} disabled={true} />
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
            <option value="CANCEL">Batal</option>
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
                <StatCard title="Total Pasien" value={patients.length} />
                <StatCard title="Total Kunjungan" value={visits.length} />
              </div>
            </>
          )}

          {activeMenu !== "dashboard" && (
            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{getPageTitle(activeMenu,mode)}</h1>
                  <p className="mt-1 text-sm text-gray-500">Kelola data {getPageTitle(activeMenu,mode).toLowerCase()}.</p>
                </div>

                {activeMenu !== "visits" && (
                    <button
                        onClick={openAddModal}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {activeMenu === "regist" ? "+ Pasien Baru" : "+ Tambah Data"}
                    </button>
                )}
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
        title={modalType === "add" ? `Tambah ${getPageTitle(activeMenu, mode)}` : `Edit ${getPageTitle(activeMenu, mode)}`}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        {renderModalForm()}
      </Modal>
    </div>
  );
}
