// src/services/api.js
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

/**
 * Le pegamos a la API para traer toda la info del candidato usando sólo su correo.
 */
export const getCandidateByEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Error al obtener candidato");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Trae el listado de todas las posiciones que están abiertas actualmente.
 */
export const getJobsList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/jobs/get-list`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Error al obtener posiciones");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Manda la postulación a la API.
 */
export const applyToJob = async ({ uuid, jobId, candidateId, applicationId, repoUrl }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid,
        jobId,
        candidateId,
        applicationId,
        repoUrl,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      let err;
      try {
        err = JSON.parse(responseText);
      } catch (e) {
        err = { message: responseText };
      }

      const errorMsg = err.message || err.error || JSON.stringify(err) || "Error al enviar postulación";
      throw new Error(`${errorMsg} | Payload: ${JSON.stringify({ uuid, jobId, candidateId, repoUrl })}`);
    }

    return await response.json(); // Si todo sale bien, la API nos devuelve { "ok": true }
  } catch (error) {
    throw error;
  }
};
