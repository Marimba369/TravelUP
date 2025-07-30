import { useState } from "react";
import { createTravelRequest } from "../services/api";

function TravelRequest() {
  const [formData, setFormData] = useState({
    description: "",
    travelDate: "",
    returnDate: "",
    isRoundTrip: false,
    needHotel: false,
    origin: "",
    destination: "",
    userId: ""
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.returnDate && formData.returnDate < formData.travelDate) {
      setMessage("A data de retorno não pode ser anterior à data de ida.");
      return;
    }

    try {
      formData.userId = 1; // simula id fixo do usuário
      await createTravelRequest(formData);
      setMessage("Pedido de viagem enviado com sucesso!");
      setFormData({
        description: "",
        travelDate: "",
        returnDate: "",
        isRoundTrip: false,
        needHotel: false,
        origin: "",
        destination: "",
        userId: ""
      });
    } catch (error) {
      //console.log(formData);
      setMessage("Erro ao enviar o pedido.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center text-primary mb-4">Solicitação de Viagem</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Origem</label>
              <input type="text" className="form-control" name="origin" value={formData.origin} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Destino</label>
              <input type="text" className="form-control" name="destination" value={formData.destination} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Data de Ida</label>
              <input type="date" className="form-control" name="travelDate" value={formData.travelDate} onChange={handleChange} required />
            </div>

            {formData.isRoundTrip && (
              <div className="mb-3">
                <label className="form-label">Data de Retorno</label>
                <input type="date" className="form-control" name="returnDate" value={formData.returnDate} onChange={handleChange} />
              </div>
            )}

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" name="isRoundTrip" checked={formData.isRoundTrip} onChange={handleChange} />
              <label className="form-check-label">Viagem de ida e volta?</label>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" name="needHotel" checked={formData.needHotel} onChange={handleChange} />
              <label className="form-check-label">Precisa de hotel?</label>
            </div>

            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary w-100">Enviar Pedido</button>
            {message && <div className="alert alert-info text-center mt-3">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default TravelRequest;
