export const getVisits = async () => {
    const response = await fetch("/api/visits");

    const data = await response.json();

    return data.visits;
};

export const addVisit = async (data) => {
    const response = await fetch("/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

    return await response.json();
}

export const getVisitById = async (id) => {
    const response = await fetch(`/api/visits/${id}`, {
        method: "GET", 
    });

    return await response.json();
};


export const updateVisit = async (id, data) => {
    const response = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
};

export const deleteVisit = async (id) => {
    const response = await fetch(`/api/visits/${id}`, {
        method: "DELETE",
    });

    return await response.json();
};

export const getVisitsByDoctor = async() => {
    const response = await fetch(`/api/visits/doctor`, {
        method: "GET", 
    });

    const data = await response.json();
    
    return data.visits;
}

export const getVisitsByRecepsionist = async() => {
    const response = await fetch(`/api/visits/recepsionist`, {
        method: "GET", 
    });

    const data = await response.json();
    
    return data.visits;
}

