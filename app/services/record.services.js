export const addRecord = async(data) => {
    const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export const getRecordsById = async (id) => {
    const response = await fetch(`/api/records/${id}/history`, {
        method: "GET", 
    });

    const data = await response.json();

    return data;
};