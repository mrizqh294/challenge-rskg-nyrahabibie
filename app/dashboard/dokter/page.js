"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import ModalBig from "../../components/ModalBig";
import Textarea from "../../components/Textarea";
import { getVisitsByDoctor } from "../../services/visit.services";
import { Table, Th, Td, EmptyRow } from "../../components/Table";
import { addRecord, getRecordsById } from "../../services/record.services";

const ADMIN_MENUS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "visits", label: "Kunjungan Pasien" },
];

const PAGE_TITLES = {
  visits: "Data Kunjungan",
  patients: "Data Pasien",
};

export default function DoctorPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({});
  const [recordHistories, setRecordHistories] = useState([]);
  

  const [visits, setVisits] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const visits = await getVisitsByDoctor();
        setVisits(visits);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);


  const getPageTitle = () => PAGE_TITLES[activeMenu] || "Dashboard";

  //modal helpers
  const openAddModal = (data) => {
    console.log(data);
    setModalType("add");
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

      if (name === "visitId") {
        const selectedVisit = visits.find((doc) => String(doc.id) === String(value));
        extraData.visitName = selectedVisit ? selectedVisit.name : "";
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

  const getRecordHistories = async (id) => {
    const recordHistories = await getRecordsById(id);
    setRecordHistories(recordHistories);
    return recordHistories;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeMenu === "visits") {
        if (modalType === "add") {
          const record = await addRecord(formData);
          alert(record.message);
        }
        const visitData = await getVisitsByDoctor();
        setVisits(visitData);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    }
  };

  //table
  const renderVisitsTable = () => (
    <Table>
      <thead>
        <tr>
          <Th>No</Th>
          <Th>Pasien</Th>
          <Th>Pendaftaran</Th>
          <Th>Keluhan</Th>
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
              <Td>{visit.recepsionist.name}</Td>
              <Td>{visit.description}</Td>
              <Td>
                <Badge
                  type={
                    visit.status === "COMPLETED"
                      ? "green"
                      : visit.status === "CANCEL"
                      ? "red"
                      : "yellow"
                  }
                >
                  {visit.status}
                </Badge>
              </Td>
              <Td>
                <button
                  className={`text-sm font-medium transition ${
                      visit.status === "COMPLETED"
                      ? "cursor-not-allowed text-gray-400"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                  onClick={() => {
                      openAddModal(
                        {
                          visitId : visit.id,
                          recordNumber : visit.patient?.recordNumber,
                          patient : visit.patient?.name,
                          visitDate : visit.visitDate,
                          doctor: visit.doctor?.name,
                          status : visit.status
                        }
                      );
                      getRecordHistories(visit.patient?.id)
                  }}
                  disabled={visit.status === "COMPLETED"}
                >
                  Periksa
                </button>
              </Td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  const renderTable = () => {
    switch (activeMenu) {
      case "visits":
        return renderVisitsTable();
      default:
        return null;
    }
  };

  //modal form
  const renderModalForm = () => {

    if (activeMenu === "visits") {
      return (
        <>
          <Input name="visitId" onChange={handleChange} value={formData.visitId} hidden={true} />
          <Textarea label="Diagnosis" name="diagnosis" value={formData.diagnosis || ""} onChange={handleChange} />
          <Textarea label="Penanganan" name="actionPlan" value={formData.actionPlan || ""} onChange={handleChange} />
          <Textarea label="Resep Dokter" name="receipt" value={formData.receipt || ""} onChange={handleChange} />
        </>
      );
    }

    return null;
  };

  //return
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

      <ModalBig
        show={showModal}
        title={modalType === "add" ? `Tambah ${getPageTitle()}` : `Edit ${getPageTitle()}`}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {/* DATA PASIEN */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-gray-800">Data Pasien</h3>

              <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div>
                  <p className="text-xs text-gray-500">No. Rekam Medis</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">{formData.recordNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Nama Pasien</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">{formData.patient}</p>
                </div>

              </div>
            </div>

            {/* RIWAYAT REKAM MEDIS */}
          <div className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800">
                Riwayat Rekam Medis
              </h3>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {recordHistories.length} Riwayat
              </span>
            </div>

            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
              {recordHistories.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600">
                      Rekam Medis
                    </span>

                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      Selesai
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Diagnosis</p>
                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {record.diagnosis}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Tindakan</p>
                      <p className="mt-1 text-sm text-gray-700">
                        {record.actionPlan}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Resep Obat</p>
                      <p className="mt-1 text-sm text-gray-700">
                        {record.receipt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>

          <div className="lg:col-span-7">
            {/* DATA KUNJUNGAN */}
            <div className="mb-7">
              <h3 className="mb-4 text-base font-semibold text-gray-800">Data Kunjungan</h3>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <p className="text-xs text-gray-500">Tanggal Kunjungan</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{formData.visitDate}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Poli</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">Poli Umum</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Dokter</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{formData.doctor}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM PEMERIKSAAN DOKTER */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-gray-800">Pemeriksaan Dokter</h3>

              <div className="space-y-5">
                {renderModalForm()}
              </div>
            </div>
          </div>
        </div>

      </ModalBig>
    </div>
  );
}
