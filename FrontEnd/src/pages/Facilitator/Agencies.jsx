import { useState } from "react";
import { createAgency } from "../../services/api";
import "../../style/Agency.css";

function Agencies() {
  const [agency, setAgency] = useState({
    name: '',
    contactEmail: '',
    phoneNumber: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setAgency({ ...agency, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validação básica
    if (!agency.name.trim() || !agency.contactEmail.trim() || !agency.phoneNumber.trim()) {
      setError('Todos os campos são obrigatórios');
      setIsSubmitting(false);
      return;
    }
    
    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agency.contactEmail)) {
      setError('Por favor, insira um e-mail válido');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await createAgency(agency);
      setMessage('Agência adicionada com sucesso!');
      setError('');
      setAgency({ name: '', contactEmail: '', phoneNumber: '' });
      
      // Animação de sucesso
      const card = document.querySelector('.agency-card');
      if (card) {
        card.classList.add('success-animation');
        setTimeout(() => card.classList.remove('success-animation'), 2000);
      }
    } catch (err) {
      console.error('Erro ao adicionar agência:', err);
      setError('Erro ao adicionar agência. Verifique os dados e tente novamente.');
      setMessage('');
      
      // Animação de erro
      const card = document.querySelector('.agency-card');
      if (card) {
        card.classList.add('error-animation');
        setTimeout(() => card.classList.remove('error-animation'), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAgency({ name: '', contactEmail: '', phoneNumber: '' });
    setMessage('');
    setError('');
  };

  return (
    <div className="container mt-4">
      <div className="agency-card card shadow-lg border-0 animate__animated animate__fadeIn">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="agency-icon mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#0d6efd" viewBox="0 0 16 16">
                <path d="M4 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                <path d="M5.5 10A1.5 1.5 0 0 1 4 8.5v-1A1.5 1.5 0 0 1 5.5 6h5A1.5 1.5 0 0 1 12 7.5v1a1.5 1.5 0 0 1-1.5 1.5h-5zm0 1A2.5 2.5 0 0 1 3 8.5v-1A2.5 2.5 0 0 1 5.5 5h5A2.5 2.5 0 0 1 13 7.5v1a2.5 2.5 0 0 1-2.5 2.5h-5z"/>
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
              </svg>
            </div>
            <h2 className="card-title text-primary mb-2">Adicionar Agência</h2>
            
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Nome da Agência *</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Nome completo da agência"
                  value={agency.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Email de Contato *</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  className="form-control"
                  name="contactEmail"
                  placeholder="exemplo@agencia.com"
                  value={agency.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Telefone *</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" viewBox="0 0 16 16">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.249l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="phoneNumber"
                  placeholder="Ex: +351 985 785 963"
                  value={agency.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary flex-grow-1"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Limpar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary flex-grow-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Salvando...
                  </>
                ) : (
                  "Salvar Agência"
                )}
              </button>
            </div>

            {message && (
              <div className="alert alert-success mt-3 mb-0 py-2 text-center animate__animated animate__fadeIn">
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3 mb-0 py-2 text-center animate__animated animate__shakeX">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Agencies;