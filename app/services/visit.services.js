export const fetchVisits = async () => {
    const response = await fetch("/api/visits");

    if (!response.ok) {
        throw new Error("Gagal mengambil data");
    }

    return await response.json();
};

export const addVisit = async (data) => {
    const response = await fetch("/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || "Terjadi kesalahan saat menambah kunjungan");
      }

    return await response.json();
}

export const getVisitById = async (id) => {
    const response = await fetch(`/api/visits/${id}`, {
        method: "GET", 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengambil detail kunjungan");
    }

    return await response.json();
};


export const editVisit = async (id, data) => {
    const response = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memperbarui data kunjungan");
    }

    return await response.json();
};

export const deleteVisit = async (id) => {
    const response = await fetch(`/api/visits/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menghapus data kunjungan");
    }

    return await response.json();
};