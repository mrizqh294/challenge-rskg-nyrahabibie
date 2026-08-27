export const addRecord = async(data) => {
    const response = await fetch("/api/records", {
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

export const getRecordsById = async (id) => {
    const response = await fetch(`/api/records/${id}/history`, {
        method: "GET", 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengambil detail kunjungan");
    }

    const data = await response.json();

    return data;
};