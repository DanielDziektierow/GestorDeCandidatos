import { useState } from 'react';
import './CandidateForm.css';

export function CandidateForm({ onSubmit }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);

        try {
            await onSubmit(email);
        } catch (err) {
            setError(err.message || 'Error al validar el email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="candidate-form-container fade-in">
            <div className="candidate-card">
                <h2>Bienvenido al Gestor</h2>
                <p>Por favor, ingresa tu email de candidato para continuar.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading || !email} className="btn-primary">
                        {isLoading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>

                {error && <div className="error-message fade-in">{error}</div>}
            </div>
        </div>
    );
}
