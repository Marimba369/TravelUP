import { useState, useEffect } from "react";
import { createTravelRequest } from "../services/api";
import api from "../services/api";
import QuoteList from "../components/QuoteList";
import "../style/TravelRequest.css";

function TravelRequest() {
  const [requestStatus, setRequestStatus] = useState('draft'); // draft, submitted
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [agencyData, setAgencyData] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [showQuotes, setShowQuotes] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [message, setMessage] = useState('');

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

  // Buscar agências
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await api.get("/Agency");
        setAgencies(response.data);
      } catch (error) {
        console.error("Erro ao buscar agências:", error);
      }
    };

    if (requestStatus === 'submitted') {
      fetchAgencies();
    }
  }, [requestStatus]);

  // Buscar detalhes da agência selecionada
  useEffect(() => {
    if (!selectedAgencyId) {
      setAgencyData(null);
      return;
    }

    const fetchAgencyDetails = async () => {
      try {
        const matchedAgency = agencies.find((agency) => agency.name === selectedAgencyId);
        const agencyId = matchedAgency ? matchedAgency.agencyId : null;

        const response = await api.get(`/Agency/${agencyId}`);
        setAgencyData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da agência", error);
      }
    };

    fetchAgencyDetails();
  }, [selectedAgencyId]);

  // Manipuladores
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
      formData.userId = 1;
      await createTravelRequest(formData);
      setMessage("Pedido de viagem enviado com sucesso!");
      setRequestStatus('submitted');
    } catch (error) {
      setMessage("Erro ao enviar o pedido.");
      console.error(error);
    }
  };

  const handleClear = () => {
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
    setMessage('');
    setSelectedAgencyId("");
    setAgencyData(null);
    setShowQuotes(false);
    setSelectedQuote(null);
    setRequestStatus('draft');
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title text-center text-primary mb-4">Solicitação de Viagem</h2>
          
          {/* Status Indicator */}
          <div className="status-bar mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={`badge ${requestStatus === 'draft' ? 'bg-info' : 'bg-success'}`}>
                {requestStatus === 'draft' ? 'Em Preenchimento' : 'Pendente de Cotação'}
              </span>
              <div className="text-muted small">
                {requestStatus === 'draft' 
                  ? 'Preencha todos os campos obrigatórios' 
                  : 'Selecione uma agência para ver cotações'}
              </div>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className={`progress-bar ${requestStatus === 'draft' ? 'bg-info' : 'bg-success'}`} 
                style={{ width: requestStatus === 'draft' ? '50%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Origem *</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  name="origin" 
                  placeholder="Cidade de origem" 
                  value={formData.origin} 
                  onChange={handleChange} 
                  required 
                  disabled={requestStatus === 'submitted'}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Destino *</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  name="destination" 
                  placeholder="Cidade de destino"
                  value={formData.destination} 
                  onChange={handleChange} 
                  required 
                  disabled={requestStatus === 'submitted'}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Data de Ida *</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm" 
                  name="travelDate" 
                  value={formData.travelDate} 
                  onChange={handleChange} 
                  required 
                  disabled={requestStatus === 'submitted'}
                />
              </div>

              {formData.isRoundTrip && (
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Data de Retorno</label>
                  <input 
                    type="date" 
                    className="form-control form-control-sm" 
                    name="returnDate" 
                    value={formData.returnDate} 
                    onChange={handleChange} 
                    disabled={requestStatus === 'submitted'}
                  />
                </div>
              )}

              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="isRoundTrip" 
                    checked={formData.isRoundTrip} 
                    onChange={handleChange} 
                    disabled={requestStatus === 'submitted'}
                  />
                  <label className="form-check-label small">Viagem de ida e volta?</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="needHotel" 
                    checked={formData.needHotel} 
                    onChange={handleChange} 
                    disabled={requestStatus === 'submitted'}
                  />
                  <label className="form-check-label small">Precisa de hotel?</label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold">Descrição</label>
                <textarea 
                  className="form-control form-control-sm" 
                  name="description" 
                  placeholder="Detalhes adicionais sobre a viagem" 
                  rows="3"
                  value={formData.description} 
                  onChange={handleChange} 
                  disabled={requestStatus === 'submitted'}
                />
              </div>
            </div>

            {/* Botões de ação */}
            {requestStatus === 'draft' && (
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={handleClear}
                >
                  Limpar Tudo
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm px-4"
                >
                  Enviar Pedido
                </button>
              </div>
            )}

            {message && (
              <div className={`alert ${requestStatus === 'submitted' ? 'alert-success' : 'alert-info'} mt-3 py-2`}>
                {message}
              </div>
            )}
          </form>

          {/* Seleção de Agência (só aparece após envio) */}
          {requestStatus === 'submitted' && (
            <div className="mt-4 pt-3 border-top">
              <h5 className="text-primary mb-3">Selecione uma agência</h5>
              
              <div className="row g-3 align-items-end">
                <div className="col-md-8">
                  <select
                    className="form-select form-select-sm"
                    value={selectedAgencyId}
                    onChange={(e) => setSelectedAgencyId(e.target.value)}
                  >
                    <option value="">Selecione uma agência</option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4">
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => setShowQuotes(true)}
                    disabled={!selectedAgencyId}
                  >
                    Ver Cotações
                  </button>
                </div>
              </div>

              {/* Exibição de cotações */}
              {showQuotes && agencyData && (
                <div className="mt-4">
                  <h6 className="text-primary mb-3">
                    Cotações de {agencyData.name}
                    <button 
                      className="btn btn-sm btn-outline-secondary float-end py-0"
                      onClick={() => setShowQuotes(false)}
                    >
                      Fechar
                    </button>
                  </h6>

                  {agencyData.quotes?.length > 0 ? (
                    <QuoteList
                      quotes={agencyData.quotes}
                      selectedQuote={selectedQuote}
                      onQuoteSelected={setSelectedQuote}
                    />
                  ) : (
                    <div className="alert alert-warning text-center py-2 small">
                      Nenhuma cotação disponível para esta agência
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TravelRequest;
