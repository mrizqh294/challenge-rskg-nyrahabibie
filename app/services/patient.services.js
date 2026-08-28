export const getPatients = async () => {
    const response = await fetch("/api/patients");

    const data = await response.json();

    return data.patients;
};

export const addPatientVisit = async (data) => {
    const response = await fetch("/api/patients/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export const addPatient = async (data) => {
    const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export const getPatientById = async (id) => {
    const response = await fetch(`/api/patients/${id}`, {
        method: "GET", 
    });

    const data= await response.json();

    return data.patient;
};


export const updatePatient = async (id, data) => {
    const response = await fetch(`/api/patients/${id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
};

export const deletePatient = async (id) => {
    const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
    });

    return await response.json();
};