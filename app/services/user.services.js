export const getUsers = async () => {
    const response = await fetch("/api/auth/users");

    const data = await response.json();

    return data.users
};

export const addUser = async (data) => {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

    return await response.json();
}

export const getUserById = async (id) => {
  const response = await fetch(`/api/auth/users/${id}`, {
    method: "GET", 
  });

  return await response.json();
};


export const updateUser = async (id, data) => {
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