export const getPatients = async () => {
    const response = await fetch("/api/patients");

    if (!response.ok) {
        throw new Error("Gagal mengambil data");
    }

    const data = await response.json();

    return data.patients;
};

export const addPatient = async (data) => {
    console.log(data);
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


export const updatePatient = async (id, data) => {
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