import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const AddQuotes = ({ travelRequestId, onQuoteSubmitted, onClear }) => {
    const [newFlight, setNewFlight] = useState({
        flightNumber: '',
        flightName: '',
        price: '',
        departure: '',
        arrival: '',
        departureDate: '',
        arrivalDate: '',
    });

    const [newHotel, setNewHotel] = useState({
        hotelName: '',
        pricePerNight: '',
        checkInDate: '',
        checkOutDate: '',
    });

    const [flights, setFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [agencies, setAgencies] = useState([]); // Array de agências
    const [selectedAgencyId, setSelectedAgencyId] = useState(''); // Estado para o ID
    const [showQuotes, setShowQuotes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Carregar agências
    useEffect(() => {
        axios.get('http://localhost:5028/api/Agency')
            .then(res => setAgencies(res.data))
            .catch(err => console.error('Erro ao carregar agências:', err));
    }, []);

    // Lógica para calcular o total da cotação de forma reativa
    const quoteTotal = useMemo(() => {
        const flightsTotal = flights.reduce((sum, flight) => sum + parseFloat(flight.price), 0);
        const hotelsTotal = hotels.reduce((sum, hotel) => {
            const checkIn = new Date(hotel.checkInDate);
            const checkOut = new Date(hotel.checkOutDate);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            return sum + (nights * parseFloat(hotel.pricePerNight));
        }, 0);
        return flightsTotal + hotelsTotal;
    }, [flights, hotels]);

    const handleFlightChange = (e) => {
        const { name, value } = e.target;
        setNewFlight({ ...newFlight, [name]: value });
    };

    const addFlight = () => {
        if (Object.values(newFlight).every(val => val !== '')) {
            setFlights([...flights, newFlight]);
            setNewFlight({
                flightNumber: '', flightName: '', price: '',
                departure: '', arrival: '', departureDate: '', arrivalDate: ''
            });
        } else {
            alert('Por favor, preencha todos os campos do voo.');
        }
    };

    const removeFlight = (indexToRemove) => {
        setFlights(flights.filter((_, index) => index !== indexToRemove));
    };

    const handleHotelChange = (e) => {
        const { name, value } = e.target;
        setNewHotel({ ...newHotel, [name]: value });
    };

    const addHotel = () => {
        if (Object.values(newHotel).every(val => val !== '')) {
            setHotels([...hotels, newHotel]);
            setNewHotel({
                hotelName: '', pricePerNight: '', checkInDate: '', checkOutDate: ''
            });
        } else {
            alert('Por favor, preencha todos os campos do hotel.');
        }
    };

    const removeHotel = (indexToRemove) => {
        setHotels(hotels.filter((_, index) => index !== indexToRemove));
    };

    const handleAddQuote = async () => {
        if (!selectedAgencyId) {
            alert('Por favor, selecione uma agência antes de finalizar.');
            return;
        }

        if (flights.length === 0 && hotels.length === 0) {
            alert('Adicione pelo menos um voo ou um hotel para finalizar a cotação.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const quoteItems = [
                ...flights.map(flight => ({
                    type: 'flight',
                    flightNumber: flight.flightNumber,
                    flightName: flight.flightName,
                    departure: flight.departure,
                    arrival: flight.arrival,
                    price: parseFloat(flight.price),
                    departureDate: flight.departureDate,
                    arrivalDate: flight.arrivalDate
                })),
                ...hotels.map(hotel => ({
                    type: 'hotel',
                    hotelName: hotel.hotelName,
                    pricePerNight: parseFloat(hotel.pricePerNight),
                    checkInDate: hotel.checkInDate,
                    checkOutDate: hotel.checkOutDate
                }))
            ];

            const matchedAgency = agencies.find((agency) => agency.name === selectedAgencyId);
            const agencyId = matchedAgency ? matchedAgency.agencyId : null;

            const quoteData = {
                requestId: travelRequestId,
                agencyId: agencyId, // Usando o estado correto
                items: quoteItems,
            };

            await axios.post('http://localhost:5028/api/quote', quoteData);

            await axios.patch(`http://localhost:5028/api/Request/${travelRequestId}/status`, {
                status: 'WaitingForSelected',
            });

            setSuccess(true);
            setIsSubmitting(false);
            onQuoteSubmitted();
        } catch (err) {
            setError('Erro ao enviar a cotação: ' + err.message);
            setIsSubmitting(false);
        }
    };


    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Adicionar Cotação para Requisição: {travelRequestId}</h4>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                        <div className="alert alert-success">
                            Cotação submetida com sucesso! Redirecionando...
                        </div>
                    )}

                    {/* Seleção de Agência */}
                    <div className="mt-4 pt-3 border-top">
                        <h5 className="text-primary mb-3">Selecione uma agência</h5>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-8">
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedAgencyId} // Usa o estado correto
                                    onChange={(e) => setSelectedAgencyId(e.target.value)} // Atualiza o estado correto
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
                                    // Valida com base no ID
                                    disabled={!selectedAgencyId || showQuotes}
                                >
                                    Adicionar Cotação
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Formulários de voos e hotéis (aparecem apenas após selecionar agência) */}
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

                            {/* Formulário de Voo */}
                            <div className="card mb-4">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">Adicionar Novo Voo</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Número do Voo *</label>
                                            <input type="text" className="form-control form-control-sm" name="flightNumber" value={newFlight.flightNumber} onChange={handleFlightChange} placeholder="Ex: TP2034" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Nome do Voo *</label>
                                            <input type="text" className="form-control form-control-sm" name="flightName" value={newFlight.flightName} onChange={handleFlightChange} placeholder="Ex: TAP" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Preço (€) *</label>
                                            <input type="number" className="form-control form-control-sm" name="price" value={newFlight.price} onChange={handleFlightChange} placeholder="Ex: 250" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Aeroporto de Partida *</label>
                                            <input type="text" className="form-control form-control-sm" name="departure" value={newFlight.departure} onChange={handleFlightChange} placeholder="Ex: Lisbon Airport" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Aeroporto de Chegada *</label>
                                            <input type="text" className="form-control form-control-sm" name="arrival" value={newFlight.arrival} onChange={handleFlightChange} placeholder="Ex: Paris Airport" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Data/Hora de Partida *</label>
                                            <input type="datetime-local" className="form-control form-control-sm" name="departureDate" value={newFlight.departureDate} onChange={handleFlightChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Data/Hora de Chegada *</label>
                                            <input type="datetime-local" className="form-control form-control-sm" name="arrivalDate" value={newFlight.arrivalDate} onChange={handleFlightChange} />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary btn-sm" type="button" onClick={addFlight}>
                                                Adicionar Voo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulário de hotel condicional */}
                            <div className="card mb-4">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">Adicionar Novo Hotel</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Nome do Hotel *</label>
                                            <input type="text" className="form-control form-control-sm" name="hotelName" value={newHotel.hotelName} onChange={handleHotelChange} placeholder="Ex: Ritz" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Preço por Noite (€) *</label>
                                            <input type="number" className="form-control form-control-sm" name="pricePerNight" value={newHotel.pricePerNight} onChange={handleHotelChange} placeholder="Ex: 70" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Check-in *</label>
                                            <input type="date" className="form-control form-control-sm" name="checkInDate" value={newHotel.checkInDate} onChange={handleHotelChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Check-out *</label>
                                            <input type="date" className="form-control form-control-sm" name="checkOutDate" value={newHotel.checkOutDate} onChange={handleHotelChange} />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary btn-sm" type="button" onClick={addHotel}>
                                                Adicionar Hotel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                                            {flight.departure}<br />
                                                            <small>{new Date(flight.departureDate).toLocaleString()}</small>
                                                        </td>
                                                        <td>
                                                            {flight.arrival}<br />
                                                            <small>{new Date(flight.arrivalDate).toLocaleString()}</small>
                                                        </td>
                                                        <td>€{parseFloat(flight.price).toFixed(2)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeFlight(index)}>
                                                                <FaTrashAlt />
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
                            {hotels.length > 0 && (
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
                                                        <td>€{parseFloat(hotel.pricePerNight).toFixed(2)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeHotel(index)}>
                                                                <FaTrashAlt />
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
                                    disabled={isSubmitting || (flights.length === 0 && hotels.length === 0)}
                                >
                                    {isSubmitting ? 'Finalizando...' : 'Finalizar Cotação'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddQuotes;