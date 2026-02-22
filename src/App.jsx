import { useState, useEffect } from 'react';
import { getCandidateByEmail, getJobsList, applyToJob } from './services/api';
import { CandidateForm } from './components/CandidateForm';
import { JobCard } from './components/JobCard';
import './App.css';

function App() {
  const [candidateData, setCandidateData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [errorJobs, setErrorJobs] = useState(null);

  // Uso de email del candidato
  const handleCandidateLogin = async (email) => {
    const data = await getCandidateByEmail(email);
    setCandidateData(data);
  };

  const loadJobs = async () => {
    setIsLoadingJobs(true);
    setErrorJobs(null);
    try {
      const data = await getJobsList();
      setJobs(data);
    } catch (error) {
      setErrorJobs(error.message || 'Error al cargar posiciones');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Una vez que tenemos los datos del candidato, traemos la lista de los trabajos disponibles
  useEffect(() => {
    if (candidateData) {
      loadJobs();
    }
  }, [candidateData]);

  const handleApply = async (applicationData) => {
    return applyToJob(applicationData);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestor de Candidatos</h1>
        {candidateData && (
          <div className="candidate-badge">
            👤 {candidateData.firstName} {candidateData.lastName}
          </div>
        )}
      </header>

      <main className="app-main">
        {!candidateData ? (
          <CandidateForm onSubmit={handleCandidateLogin} />
        ) : (
          <div className="jobs-section fade-in">
            <div className="jobs-header">
              <h2>Posiciones Abiertas</h2>
              <button onClick={loadJobs} className="btn-secondary" disabled={isLoadingJobs}>
                🔄 Actualizar
              </button>
            </div>

            {isLoadingJobs && <p className="loading-state">Cargando posiciones...</p>}
            {errorJobs && <p className="error-message">{errorJobs}</p>}

            {!isLoadingJobs && !errorJobs && jobs.length === 0 && (
              <p className="empty-state">No hay posiciones abiertas en este momento.</p>
            )}

            <div className="jobs-list">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  candidateData={candidateData}
                  onApply={handleApply}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
