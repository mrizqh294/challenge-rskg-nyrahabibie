export const fetchPatients = async () => {
    const response = await fetch("/api/patients");

    if (!response.ok) {
        throw new Error("Gagal mengambil data");
    }

    return await response.json();
};

export const addPatient = async (data) => {
    const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || "Terjadi kesalahan saat menambah pasien");
      }

    return await response.json();
}

export const getPatientById = async (id) => {
    const response = await fetch(`/api/patients/${id}`, {
        method: "GET", 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengambil detail pasien");
    }

    return await response.json();
};


export const editPatient = async (id, data) => {
    const response = await fetch(`/api/patients/${id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memperbarui data pasien");
    }

    return await response.json();
};

export const deletePatient = async (id) => {
    const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menghapus data pasien");
    }

    return await response.json();
};