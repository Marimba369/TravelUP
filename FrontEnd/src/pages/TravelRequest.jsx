import { useState, useEffect } from "react";
import { createTravelRequest } from "../services/api";
import api from "../services/api";
import "../style/TravelRequest.css";

const StatusEnum = Object.freeze({
  Draft: "draft",
  Submitted: "submitted",
  WaitingForQuotes: "waitingForQuotes",
  QuotesAvailable: "quotesAvailable",
  QuoteSelected: "quoteSelected",
  WaitingForApproval: "waitingForApproval",
  Approved: "approved",
  Rejected: "rejected",
  Pending: "pending",
  Cancelled: "cancelled"
});

function TravelRequest() {
  const [requestStatus, setRequestStatus] = useState(StatusEnum.Draft);
  const [selectedAgencyName, setSelectedAgencyName] = useState("");
  const [agencyData, setAgencyData] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [showQuotes, setShowQuotes] = useState(false);
  const [message, setMessage] = useState('');
  const [travelRequestId, setTravelRequestId] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [quoteTotal, setQuoteTotal] = useState(0); // Estado para o total reativo

  const [formData, setFormData] = useState({
    description: "",
    travelDate: "",
    returnDate: "",
    isRoundTrip: false,
    needHotel: false,
    origin: "",
    destination: "",
    userId: "",
    status: ""
  });

  // Estados para formulários de voos e hotéis
  const [newFlight, setNewFlight] = useState({
      flightNumber: "",
      flightName: "",
      departure: "",
      arrivalDate: "",
      departureDate: "",
      arrival: "",
      price: ""
  });

  const [newHotel, setNewHotel] = useState({
    hotelName: "",
    checkInDate: "",
    checkOutDate: "",
    pricePerNight: ""
  });

  // Estados para listas de voos e hotéis
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);

  // Calcular total de forma reativa
  useEffect(() => {
    const flightsTotal = flights.reduce((sum, flight) => sum + flight.price, 0);
    const hotelsTotal = hotels.reduce((sum, hotel) => sum + (hotel.pricePerNight || 0), 0);
    setQuoteTotal(flightsTotal + hotelsTotal);
  }, [flights, hotels]);

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

    if (requestStatus === StatusEnum.Submitted) {
      fetchAgencies();
    }
  }, [requestStatus]);

  // Buscar detalhes da agência selecionada
  useEffect(() => {
    if (!selectedAgencyName) {
      setAgencyData(null);
      return;
    }

    const fetchAgencyDetails = async () => {
      try {
        const matchedAgency = agencies.find((agency) => agency.name === selectedAgencyName);
        const agencyId = matchedAgency ? matchedAgency.agencyId : null;

        const response = await api.get(`/Agency/${agencyId}`);
        setAgencyData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da agência", error);
      }
    };

    fetchAgencyDetails();
  }, [selectedAgencyName, agencies]);

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
      formData.returnDate = (!formData.isRoundTrip) ? null : formData.returnDate;
      formData.status = requestStatus;

      const requestData = {
        ...formData,
        userId: 1,
      };
      
      const response = await createTravelRequest(requestData);
      const requestId = response.data.requestId;
      setTravelRequestId(requestId);

      setMessage("Pedido de viagem enviado com sucesso!");
      setRequestStatus(StatusEnum.Submitted);
    } catch (error) {
      let errorMessage = "Erro ao enviar o pedido.";
      
      if (error.response && error.response.data) {
        errorMessage += ` Detalhes: ${JSON.stringify(error.response.data)}`;
      }
      
      setMessage(errorMessage);
      console.error("Erro completo:", error);
    }
  };

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setNewFlight(prev => ({ ...prev, [name]: value }));
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prev => ({ ...prev, [name]: value }));
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
      userId: "",
      status: ""
    });
    setMessage('');
    setSelectedAgencyName("");
    setAgencyData(null);
    setShowQuotes(false);
    setRequestStatus(StatusEnum.Draft);
    setFlights([]);
    setHotels([]);
    setTotalCost(0);
    setQuoteTotal(0);
    setTravelRequestId(null);
  };

  // Adicionar um novo voo
  const addFlight = () => {
    if (!newFlight.flightNumber || !newFlight.departure || !newFlight.arrival || !newFlight.price || !newFlight.flightName) {
      setMessage("Preencha todos os campos do voo.");
      return;
    }

    const flightToAdd = {
      ...newFlight,
      price: parseFloat(newFlight.price),
      type: "flight"
    };

    setFlights(prev => [...prev, flightToAdd]);
    
    setNewFlight({
      flightNumber: "",
      flightName: "",
      departure: "",
      arrival: "",
      departureDate: "",
      arrivalDate: "",
      price: ""
    });
  };

  // Adicionar um novo hotel (só se needHotel for true)
  const addHotel = () => {
    if (!formData.needHotel) return; // Não adicionar se não precisa de hotel
    
    if (!newHotel.hotelName || !newHotel.checkInDate || !newHotel.checkOutDate || !newHotel.pricePerNight) {
      setMessage("Preencha todos os campos do hotel.");
      return;
    }

    const hotelToAdd = {
      ...newHotel,
      pricePerNight: parseFloat(newHotel.pricePerNight),
      type: "hotel"
    };

    setHotels(prev => [...prev, hotelToAdd]);
    
    setNewHotel({
      hotelName: "",
      checkInDate: "",
      checkOutDate: "",
      pricePerNight: ""
    });
  };

  // Remover um voo
  const removeFlight = (index) => {
    setFlights(prev => prev.filter((_, i) => i !== index));
  };

  // Remover um hotel
  const removeHotel = (index) => {
    setHotels(prev => prev.filter((_, i) => i !== index));
  };

  // Função para buscar o custo total do backend
  const fetchTotalCost = async (quoteId) => {
    try {
      const response = await api.get(`/Quote/${quoteId}/total`);
      setTotalCost(response.data.totalQuote);
    } catch (error) {
      console.error("Erro ao buscar custo total:", error);
    }
  };

  const handleAddQuote = async () => {
    try {
      if (flights.length === 0 && (formData.needHotel && hotels.length === 0)) {
        setMessage("Adicione pelo menos um voo ou hotel.");
        return;
      }

      if (!travelRequestId) {
        setMessage("ID da solicitação não encontrado. Por favor, recarregue a página e tente novamente.");
        return;
      }

      const agencyCurrentId = agencyData.agencyId;

      const quoteData = {
        agencyId: agencyCurrentId,
        requestId: travelRequestId,
        items: [
          ...flights,
          ...hotels
        ]
      };

      const response = await api.post('/Quote', quoteData);
      const quoteId = response.data.quoteId;
      
      await fetchTotalCost(quoteId);
      setMessage("Cotação enviada com sucesso!");

      setRequestStatus(StatusEnum.Pending);
      await api.put(`/request/${travelRequestId}/status`, requestStatus);

      setFlights([]);
      setHotels([]);
      setShowQuotes(false);
    } catch (error) {
      let errorMessage = "Erro ao adicionar cotação.";
      
      if (error.response && error.response.data) {
        errorMessage += ` Detalhes: ${JSON.stringify(error.response.data)}`;
      }
      
      setMessage(errorMessage);
      console.error("Erro completo:", error);
    }
  };

  // Função para determinar o texto e classe do estado
  const getStatusInfo = () => {
    switch (requestStatus) {
      case StatusEnum.Draft:
        return {
          text: "Em Preenchimento", //draft
          badgeClass: "bg-info",
          progress: 33,
          description: "Preencha todos os campos obrigatórios"
        };
      case StatusEnum.Submitted:
        return {
          text: "Aguardando Cotação", //submited
          badgeClass: "bg-warning",
          progress: 66,
          description: "Selecione uma agência para adicionar cotações"
        };
      case StatusEnum.Pending:
        return {
          text: "Pendente de Cotação", //waiting4selection
          badgeClass: "bg-primary",
          progress: 100,
          description: "Sua cotação foi enviada e está pendente de aprovação"
        };
      default:
        return {
          text: "Em Preenchimento",
          badgeClass: "bg-info",
          progress: 33,
          description: "Preencha todos os campos obrigatórios"
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title text-center text-primary mb-4">Solicitação de Viagem</h2>

          {/* Status Indicator */}
          <div className="status-bar mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={`badge ${statusInfo.badgeClass}`}>
                {statusInfo.text}
              </span>
              <div className="text-muted small">
                {statusInfo.description}
              </div>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className={`progress-bar ${statusInfo.badgeClass}`}
                style={{ width: `${statusInfo.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Exibir mensagem */}
          {message && (
            <div className={`alert ${
              requestStatus === StatusEnum.Submitted ? 'alert-success' : 
              requestStatus === StatusEnum.Pending ? 'alert-info' : 
              'alert-info'
            } mb-3 py-2`}>
              {message}
            </div>
          )}

          {/* Formulário */}
          {requestStatus !== StatusEnum.Pending && (
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
                    disabled={requestStatus !== StatusEnum.Draft}
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
                    disabled={requestStatus !== StatusEnum.Draft}
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
                    disabled={requestStatus !== StatusEnum.Draft}
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
                      disabled={requestStatus !== StatusEnum.Draft}
                    />
                  </div>
                )}

                <div className="col-12">
                  <div className="d-flex gap-4 align-items-center">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isRoundTrip"
                        checked={formData.isRoundTrip}
                        onChange={handleChange}
                        disabled={requestStatus !== StatusEnum.Draft}
                      />
                      <label className="form-check-label small">Viagem de ida e volta?</label>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="needHotel"
                        checked={formData.needHotel}
                        onChange={handleChange}
                        disabled={requestStatus !== StatusEnum.Draft}
                      />
                      <label className="form-check-label small">Precisa de hotel?</label>
                    </div>
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
                    disabled={requestStatus !== StatusEnum.Draft}
                  />
                </div>
              </div>

              {/* Botões de ação */}
              {requestStatus === StatusEnum.Draft && (
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
                    Submeter
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Seleção de Agência (só aparece após envio) */}
          {requestStatus === StatusEnum.Submitted && (
            <div className="mt-4 pt-3 border-top">
              <h5 className="text-primary mb-3">Selecione uma agência</h5>

              <div className="row g-3 align-items-end">
                <div className="col-md-8">
                  <select
                    className="form-select form-select-sm"
                    value={selectedAgencyName}
                    onChange={(e) => setSelectedAgencyName(e.target.value)}
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
                    disabled={!selectedAgencyName}
                  >
                    Adicionar Cotação
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulários de voos e hotéis */}
          {showQuotes && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-primary mb-0">Adicionar Cotação</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowQuotes(false)}
                >
                  Cancelar
                </button>
              </div>

              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Adicionar Novo Voo</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Número do Voo *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="flightNumber"
                        value={newFlight.flightNumber}
                        onChange={handleFlightChange}
                        placeholder="Ex: TP2034"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Nome do Voo *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="flightName"
                        value={newFlight.flightName}
                        onChange={handleFlightChange}
                        placeholder="Ex: TAP"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Preço (€) *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="price"
                        value={newFlight.price}
                        onChange={handleFlightChange}
                        placeholder="Ex: 250"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Aeroporto de Partida *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="departure"
                        value={newFlight.departure}
                        onChange={handleFlightChange}
                        placeholder="Ex: Lisbon Airport"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Aeroporto de Chegada *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="arrival"
                        value={newFlight.arrival}
                        onChange={handleFlightChange}
                        placeholder="Ex: Paris Airport"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Data/Hora de Partida *</label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-sm"
                        name="departureDate"
                        value={newFlight.departureDate}
                        onChange={handleFlightChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Data/Hora de Chegada *</label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-sm"
                        name="arrivalDate"
                        value={newFlight.arrivalDate}
                        onChange={handleFlightChange}
                      />
                    </div>

                    <div className="col-12">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={addFlight}
                      >
                        Adicionar Voo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário de hotel condicional */}
              {formData.needHotel && (
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Adicionar Novo Hotel</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Nome do Hotel *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="hotelName"
                          value={newHotel.hotelName}
                          onChange={handleHotelChange}
                          placeholder="Ex: Ritz"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Preço por Noite (€) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="pricePerNight"
                          value={newHotel.pricePerNight}
                          onChange={handleHotelChange}
                          placeholder="Ex: 70"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Check-in *</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name="checkInDate"
                          value={newHotel.checkInDate}
                          onChange={handleHotelChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Check-out *</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name="checkOutDate"
                          value={newHotel.checkOutDate}
                          onChange={handleHotelChange}
                        />
                      </div>

                      <div className="col-12">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={addHotel}
                        >
                          Adicionar Hotel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de voos adicionados */}
              {flights.length > 0 && (
                <div className="card mb-4">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Voos Adicionados</h6>
                    <span className="badge bg-primary">
                      {flights.length} voo(s)
                    </span>
                  </div>
                  <div className="card-body">
                    <table className="table table-sm table-hover">
                      <thead>
                        <tr>
                          <th>Voo</th>
                          <th>Partida</th>
                          <th>Chegada</th>
                          <th>Preço</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flights.map((flight, index) => (
                          <tr key={index}>
                            <td>{flight.flightNumber}</td>
                            <td>
                              {flight.departureAirport}<br />
                              <small>{new Date(flight.departureDate).toLocaleString()}</small>
                            </td>
                            <td>
                              {flight.arrivalAirport}<br />
                              <small>{new Date(flight.arrivalDate).toLocaleString()}</small>
                            </td>
                            <td>€{flight.price.toFixed(2)}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFlight(index)}
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Lista de hotéis adicionados */}
              {formData.needHotel && hotels.length > 0 && (
                <div className="card mb-4">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Hotéis Adicionados</h6>
                    <span className="badge bg-primary">
                      {hotels.length} hotel(is)
                    </span>
                  </div>
                  <div className="card-body">
                    <table className="table table-sm table-hover">
                      <thead>
                        <tr>
                          <th>Hotel</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Preço/Noite</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotels.map((hotel, index) => (
                          <tr key={index}>
                            <td>{hotel.hotelName}</td>
                            <td>{hotel.checkInDate}</td>
                            <td>{hotel.checkOutDate}</td>
                            <td>€{hotel.pricePerNight.toFixed(2)}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeHotel(index)}
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Resumo da cotação com total reativo */}
              <div className="d-flex justify-content-between align-items-center mt-4 p-3 border rounded bg-light">
                <div>
                  <h5 className="mb-0">Total Cotação: €{quoteTotal.toFixed(2)}</h5>
                  <small className="text-muted">
                    {flights.length} voo(s) e {hotels.length} hotel(is)
                  </small>
                </div>
                <button
                  className="btn btn-success"
                  onClick={handleAddQuote}
                >
                  Finalizar Cotação
                </button>
              </div>
            </div>
          )}

          {/* Mensagem para estado Pendente */}
          {requestStatus === StatusEnum.Pending && (
            <div className="alert alert-info mt-4">
              <h5 className="alert-heading">Solicitação Pendente</h5>
              <p>
                Sua cotação foi registrada com sucesso e está agora pendente de aprovação.
                Você será notificado quando houver atualizações sobre o status da sua solicitação.
              </p>
              <div>
                <strong>Custo total: €{totalCost.toFixed(2)}</strong>
              </div>
              <button 
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={handleClear}
              >
                Criar Nova Solicitação
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TravelRequest;