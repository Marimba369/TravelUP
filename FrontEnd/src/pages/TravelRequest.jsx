import React, { useState, useMemo, useEffect } from "react";
import { createTravelRequest } from "../services/api";
import ComboBox from '../components/ComboBox'; 
import "../style/TravelRequest.css";

const StatusEnum = Object.freeze({
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

function TravelerRequest() {
  // Estado corrigido: sempre inicia como Draft
  const [requestStatusEnum, setRequestStatusEnum] = useState(StatusEnum.Draft);
  const [message, setMessage] = useState('');
  const [travelRequestId, setTravelRequestId] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    travelDate: "",
    returnDate: "",
    isRoundTrip: false,
    needHotel: false,
    userId: "",
    projectId: null,
    originCityId: null,
    destinationCityId: null
  });

  // Estados para seleções
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedOriginCountry, setSelectedOriginCountry] = useState(null);
  const [selectedOriginCity, setSelectedOriginCity] = useState(null);
  const [selectedDestinationCountry, setSelectedDestinationCountry] = useState(null);
  const [selectedDestinationCity, setSelectedDestinationCity] = useState(null);

  // Resetar o estado ao montar o componente
  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    setRequestStatusEnum(StatusEnum.Draft);
    setMessage('');
    setTravelRequestId(null);
    setFormData({
      description: "",
      travelDate: "",
      returnDate: "",
      isRoundTrip: false,
      needHotel: false,
      userId: "",
      projectId: null,
      originCityId: null,
      destinationCityId: null
    });
    setSelectedProject(null);
    setSelectedOriginCountry(null);
    setSelectedOriginCity(null);
    setSelectedDestinationCountry(null);
    setSelectedDestinationCity(null);
  };

  const originCityDependencies = useMemo(() => ({
    countryName: selectedOriginCountry?.name
  }), [selectedOriginCountry?.name]);

  const destinationCityDependencies = useMemo(() => ({
    countryName: selectedDestinationCountry?.name
  }), [selectedDestinationCountry?.name]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de datas
    if (formData.returnDate && formData.returnDate < formData.travelDate) {
      setMessage("A data de retorno não pode ser anterior à data de ida.");
      return;
    }

    // Validação de cidades
    if (!selectedOriginCity || !selectedDestinationCity) {
      setMessage("Por favor, selecione as cidades de origem e destino.");
      return;
    }

    try {
      const requestData = {
        description: formData.description,
        travelDate: formData.travelDate,
        returnDate: formData.isRoundTrip ? formData.returnDate : null,
        isRoundTrip: formData.isRoundTrip,
        needHotel: formData.needHotel,
        userId: 1, // TODO: substituir pelo ID do usuário logado
        status: StatusEnum.WaitingForQuotes,
        projectId: selectedProject ? selectedProject.id : null,
        originCityId: selectedOriginCity.id,
        destinationCityId: selectedDestinationCity.id
      };

      console.log(requestData, StatusEnum.WaitingForQuotes);

      const response = await createTravelRequest(requestData);
      const requestId = response.data.requestId;
      
      setTravelRequestId(requestId);
      setMessage("Pedido de viagem enviado com sucesso! Aguarde as cotações.");
      setRequestStatusEnum(StatusEnum.Submitted);
    } catch (error) {
      setMessage("Erro ao enviar o pedido. Por favor, tente novamente.");
      console.error("Erro completo:", error);
    }
  };

  const getStatusEnumInfo = () => {
    switch (requestStatusEnum) {
      case StatusEnum.Draft:
        return {
          text: "Em Preenchimento",
          badgeClass: "bg-info",
          progress: 33,
          description: "Preencha todos os campos obrigatórios"
        };
      case StatusEnum.Submitted:
        return {
          text: "Aguardando Cotação",
          badgeClass: "bg-warning",
          progress: 66,
          description: "Seu pedido foi enviado e está aguardando cotação"
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

  const StatusEnumInfo = getStatusEnumInfo();

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title text-center text-primary mb-4">Solicitação de Viagem</h2>

          <div className="StatusEnum-bar mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={`badge ${StatusEnumInfo.badgeClass}`}>
                {StatusEnumInfo.text}
              </span>
              <div className="text-muted small">
                {StatusEnumInfo.description}
              </div>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className={`progress-bar ${StatusEnumInfo.badgeClass}`}
                style={{ width: `${StatusEnumInfo.progress}%` }}
              ></div>
            </div>
          </div>

          {message && (
            <div className={`alert ${
              requestStatusEnum === StatusEnum.Submitted ? 'alert-success' : 
              message.includes("Erro") ? 'alert-danger' : 'alert-info'
            } mb-3 py-2`}>
              {message}
            </div>
          )}

          {requestStatusEnum === StatusEnum.Draft ? (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">Projeto (Opcional)</label>
                  <ComboBox
                    fetchUrl="/Project"
                    placeholder="Selecione um projeto..."
                    onSelect={setSelectedProject}
                    initialValue={selectedProject ? selectedProject.name : ""}
                  />
                  {selectedProject && (
                    <div className="form-text mt-1">Projeto selecionado: {selectedProject.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">País de Origem *</label>
                  <ComboBox
                    fetchUrl="/Locations/countries"
                    placeholder="Digite o nome do país de origem..."
                    onSelect={setSelectedOriginCountry}
                    initialValue={selectedOriginCountry ? selectedOriginCountry.name : ""}
                  />
                  {selectedOriginCountry && (
                    <div className="form-text mt-1">País selecionado: {selectedOriginCountry.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Cidade de Origem *</label>
                  <ComboBox
                    fetchUrl={selectedOriginCountry ? `/Locations/cities-by-country/${selectedOriginCountry.name}` : ""}
                    placeholder="Digite o nome da cidade de origem..."
                    onSelect={setSelectedOriginCity}
                    initialValue={selectedOriginCity ? selectedOriginCity.name : ""}
                    disabled={!selectedOriginCountry}
                    dependencies={originCityDependencies}
                  />
                  {selectedOriginCity && (
                    <div className="form-text mt-1">Cidade selecionada: {selectedOriginCity.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">País de Destino *</label>
                  <ComboBox
                    fetchUrl="/Locations/countries"
                    placeholder="Digite o nome do país de destino..."
                    onSelect={setSelectedDestinationCountry}
                    initialValue={selectedDestinationCountry ? selectedDestinationCountry.name : ""}
                  />
                  {selectedDestinationCountry && (
                    <div className="form-text mt-1">País selecionado: {selectedDestinationCountry.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Cidade de Destino *</label>
                  <ComboBox
                    fetchUrl={selectedDestinationCountry ? `/Locations/cities-by-country/${selectedDestinationCountry.name}` : ""}
                    placeholder="Digite o nome da cidade de destino..."
                    onSelect={setSelectedDestinationCity}
                    initialValue={selectedDestinationCity ? selectedDestinationCity.name : ""}
                    disabled={!selectedDestinationCountry}
                    dependencies={destinationCityDependencies}
                  />
                  {selectedDestinationCity && (
                    <div className="form-text mt-1">Cidade selecionada: {selectedDestinationCity.name}</div>
                  )}
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
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={resetForm}
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
            </form>
          ) : requestStatusEnum === StatusEnum.Submitted ? (
            <div className="alert alert-success">
              <p>Seu pedido foi enviado com sucesso! Número do pedido: {travelRequestId}</p>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={resetForm}
                >
                  Criar Nova Solicitação
                </button>
                <div className="text-muted small">
                  Seu pedido está agora aguardando cotações das agências
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TravelerRequest;