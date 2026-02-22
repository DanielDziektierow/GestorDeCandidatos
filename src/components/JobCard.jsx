import { useState } from 'react';
import './JobCard.css';

export function JobCard({ job, candidateData, onApply }) {
    const [repoUrl, setRepoUrl] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!repoUrl) return;

        setIsApplying(true);
        setError(null);
        setSuccess(false);

        try {
            await onApply({
                uuid: candidateData.uuid,
                jobId: job.id,
                candidateId: candidateData.candidateId,
                applicationId: candidateData.applicationId,
                repoUrl: repoUrl
            });
            setSuccess(true);
            setRepoUrl('');
        } catch (err) {
            setError(err.message || 'Error occurred while applying');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className={`job-card ${success ? 'success' : ''}`}>
            <div className="job-info">
                <h3>{job.title}</h3>
                <p className="job-id">ID: {job.id}</p>
            </div>

            <form className="job-apply-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        disabled={isApplying || success}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isApplying || !repoUrl || success}
                        className={success ? 'btn-success' : ''}
                    >
                        {isApplying ? 'Enviando...' : success ? 'Postulado ✓' : 'Submit'}
                    </button>
                </div>
            </form>

            {error && <div className="error-message fade-in">{error}</div>}
            {success && <div className="success-message fade-in">¡Postulación enviada con éxito!</div>}
        </div>
    );
}
