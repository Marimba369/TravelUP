import { useState } from "react";
import { createAgency } from "../services/api";

function AddAgency() {
  const [agency, setAgency] = useState({
    name: '',
    contactEmail: '',
    phoneNumber: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAgency({ ...agency, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAgency(agency);
      setMessage('Agência adicionada com sucesso!');
      setError('');
      setAgency({ name: '', contactEmail: '', phoneNumber: '' });
    } catch (err) {
      console.error('Erro ao adicionar agência:', err);
      setError('Erro ao adicionar agência. Verifique os dados e tente novamente.');
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center text-primary mb-4">Adicionar Agência</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={agency.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="contactEmail"
                value={agency.contactEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Telefone</label>
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                value={agency.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Salvar</button>

            {message && <div className="alert alert-success text-center mt-3">{message}</div>}
            {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAgency;
