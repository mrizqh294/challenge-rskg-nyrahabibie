export const fetchUsers = async () => {
    const response = await fetch("/api/auth/users");

    if (!response.ok) {
      throw new Error("Gagal mengambil data");
    }

    return await response.json();
};

export const addUser = async (data) => {
    const response = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || "Terjadi kesalahan saat menambah user");
      }

    return await response.json();
}

export const getUserById = async (id) => {
  const response = await fetch(`/api/auth/users/${id}`, {
    method: "GET", 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal mengambil detail user");
  }

  return await response.json();
};


export const editUser = async (id, data) => {
  const response = await fetch(`/api/auth/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal memperbarui data user");
  }

  return await response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`/api/auth/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal menghapus data user");
  }

  return await response.json();
};