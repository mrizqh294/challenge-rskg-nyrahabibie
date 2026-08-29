export const logout = async() => {
  const response = await fetch(`/api/auth/logout`, {
    method: "POST", 
  });

  return await response.json();
}

export const me = async() => {
  const response = await fetch(`/api/auth/me`, {
    method: "GET", 
  });

  const data = await response.json();
  
  return data.user;
}

export const login = async(user) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

    return await response.json();
}