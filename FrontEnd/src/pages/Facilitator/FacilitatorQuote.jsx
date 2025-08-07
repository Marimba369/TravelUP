import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../style/TravelRequest.css";

const Status = Object.freeze({
  Draft : "draft",
  Submitted : "submitted",
  WaitingForQuotes : "waitingForQuotes",
  QuotesAvailable : "quotesAvailable",
  QuoteSelected : "quoteSelected",
  WaitingForApproval : "waitingForApproval",
  Approved : "approved",
  Rejected : "rejected",
  Pending : "pending",
  Cancelled : "cancelled"
})

function FacilitatorQuote({ requestId }) {
  const [selectedAgencyName, setSelectedAgencyName] = useState("");
  const [agencyData, setAgencyData] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [message, setMessage] = useState('');
  const [quoteTotal, setQuoteTotal] = useState(0);

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

  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [requestDetails, setRequestDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar detalhes do pedido e agências
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar detalhes do pedido
        const requestResponse = await api.get(`/request/${requestId}`);
        setRequestDetails(requestResponse.data);
        
        // Buscar agências
        const agenciesResponse = await api.get("/Agency");
        setAgencies(agenciesResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setMessage("Erro ao carregar dados do pedido. Tente recarregar a página.");
      }
    };

    fetchData();
  }, [requestId]);

  // Calcular total da cotação
  useEffect(() => {
    const flightsTotal = flights.reduce((sum, flight) => sum + parseFloat(flight.price || 0), 0);
    const hotelsTotal = hotels.reduce((sum, hotel) => sum + parseFloat(hotel.pricePerNight || 0), 0);
    setQuoteTotal(flightsTotal + hotelsTotal);
  }, [flights, hotels]);

  // Buscar detalhes da agência selecionada
  useEffect(() => {
    if (!selectedAgencyName) {
      setAgencyData(null);
      return;
    }
    
    const matchedAgency = agencies.find(agency => agency.agencyId == selectedAgencyName);
    setAgencyData(matchedAgency || null);
  }, [selectedAgencyName, agencies]);

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setNewFlight(prev => ({ ...prev, [name]: value }));
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prev => ({ ...prev, [name]: value }));
  };

  const addFlight = () => {
    if (!newFlight.flightNumber || !newFlight.flightName || !newFlight.departure || 
        !newFlight.arrival || !newFlight.departureDate || !newFlight.arrivalDate || !newFlight.price) {
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
    setMessage('');
  };

  const addHotel = () => {
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
    setMessage('');
  };

  const removeFlight = (index) => {
    setFlights(prev => prev.filter((_, i) => i !== index));
  };

  const removeHotel = (index) => {
    setHotels(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddQuote = async () => {
    setIsSubmitting(true);
    setMessage('');
    
    try {
      if (!agencyData) {
        setMessage("Selecione uma agência.");
        return;
      }

      if (flights.length === 0 && hotels.length === 0) {
        setMessage("Adicione pelo menos um voo ou hotel.");
        return;
      }

      const quoteData = {
        agencyId: agencyData.agencyId,
        requestId: requestId,
        items: [...flights, ...hotels]
      };

      await api.post('/Quote', quoteData);
      
      // Atualizar status do pedido para Pending
      await api.put(`/request/${requestId}/status`, { status: Status.Pending });
      
      setMessage("Cotação adicionada com sucesso! O pedido agora está pendente de aprovação.");
      
      // Resetar formulário após sucesso
      setFlights([]);
      setHotels([]);
      setSelectedAgencyName("");
    } catch (error) {
      let errorMsg = "Erro ao adicionar cotação.";
      if (error.response && error.response.data) {
        errorMsg += ` Detalhes: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      setMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!requestDetails) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <span className="ms-2">Carregando detalhes do pedido...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title text-center text-primary mb-4">
            Adicionar Cotação ao Pedido #{requestId}
          </h2>

          {/* Resumo do pedido */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Detalhes do Pedido</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Origem:</strong> {requestDetails.originCity?.name}</p>
                  <p><strong>Destino:</strong> {requestDetails.destinationCity?.name}</p>
                  <p><strong>Data de Ida:</strong> {new Date(requestDetails.travelDate).toLocaleDateString()}</p>
                </div>
                <div className="col-md-6">
                  {requestDetails.isRoundTrip && (
                    <p><strong>Data de Retorno:</strong> {new Date(requestDetails.returnDate).toLocaleDateString()}</p>
                  )}
                  <p><strong>Precisa de Hotel:</strong> {requestDetails.needHotel ? "Sim" : "Não"}</p>
                  {requestDetails.project && (
                    <p><strong>Projeto:</strong> {requestDetails.project.name}</p>
                  )}
                </div>
              </div>
              {requestDetails.description && (
                <p><strong>Descrição:</strong> {requestDetails.description}</p>
              )}
            </div>
          </div>

          {message && (
            <div className={`alert ${
              message.includes("sucesso") ? 'alert-success' : 
              message.includes("Erro") ? 'alert-danger' : 'alert-warning'
            } mb-3 py-2`}>
              {message}
            </div>
          )}

          <div className="mt-4">
            <h5 className="text-primary mb-3">Selecione uma agência</h5>
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <select
                  className="form-select form-select-sm"
                  value={selectedAgencyName}
                  onChange={(e) => setSelectedAgencyName(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma agência</option>
                  {agencies.map((agency) => (
                    <option key={agency.agencyId} value={agency.agencyId}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedAgencyName && (
            <div className="mt-4">
              {/* Formulários para adicionar voos e hotéis */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Adicionar Novo Voo</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Número do Voo *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="flightNumber"
                        value={newFlight.flightNumber}
                        onChange={handleFlightChange}
                        placeholder="Ex: TP2034"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Companhia Aérea *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="flightName"
                        value={newFlight.flightName}
                        onChange={handleFlightChange}
                        placeholder="Ex: TAP Air Portugal"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Preço (€) *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="price"
                        value={newFlight.price}
                        onChange={handleFlightChange}
                        placeholder="Ex: 250.00"
                        step="0.01"
                        min="0"
                        disabled={isSubmitting}
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
                        placeholder="Ex: Lisboa (LIS)"
                        disabled={isSubmitting}
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
                        placeholder="Ex: Paris (CDG)"
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="col-12">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={addFlight}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Adicionar Voo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {requestDetails.needHotel && (
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
                          placeholder="Ex: Hotel Ritz"
                          disabled={isSubmitting}
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
                          placeholder="Ex: 120.00"
                          step="0.01"
                          min="0"
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="col-12">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={addHotel}
                          disabled={isSubmitting}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Adicionar Hotel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de voos e hotéis adicionados */}
              {(flights.length > 0 || hotels.length > 0) && (
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Itens Adicionados na Cotação</h6>
                  </div>
                  <div className="card-body">
                    {flights.length > 0 && (
                      <>
                        <h6 className="mt-3">Voos</h6>
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th>Voo</th>
                              <th>Companhia</th>
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
                                <td>{flight.flightName}</td>
                                <td>
                                  {flight.departure}
                                  <div className="text-muted small">
                                    {new Date(flight.departureDate).toLocaleString()}
                                  </div>
                                </td>
                                <td>
                                  {flight.arrival}
                                  <div className="text-muted small">
                                    {new Date(flight.arrivalDate).toLocaleString()}
                                  </div>
                                </td>
                                <td>€{flight.price.toFixed(2)}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeFlight(index)}
                                    disabled={isSubmitting}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}

                    {hotels.length > 0 && (
                      <>
                        <h6 className="mt-4">Hotéis</h6>
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
                                    disabled={isSubmitting}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Resumo e botão de envio */}
              <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-light">
                <div>
                  <h5 className="mb-0">Total da Cotação: €{quoteTotal.toFixed(2)}</h5>
                  <div className="small text-muted">
                    {flights.length} voo(s) e {hotels.length} hotel(is)
                  </div>
                </div>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleAddQuote}
                  disabled={isSubmitting || (flights.length === 0 && hotels.length === 0)}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviando...
                    </>
                  ) : (
                    "Enviar Cotação"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacilitatorQuote;