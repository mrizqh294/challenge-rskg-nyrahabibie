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