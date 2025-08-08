import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/HomeManager.css'; 

const HomeManager = () => {
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
 
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [requestsResponse, projectsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:5028/api/request'),
          axios.get('http://localhost:5028/api/Project'),
          axios.get('http://localhost:5028/api/Users'),
        ]);

        const projects = projectsResponse.data;
        const requestsData = requestsResponse.data;
        const users = usersResponse.data;

        
        const projectsMap = new Map(projects.map(p => [p.id, p]));
        const usersMap = new Map(users.map(u => [u.userId, u]));

        // Processa as requisições para adicionar o orçamento disponível e o nome do utilizador
        const processedRequests = requestsData.map(request => {
          const project = projectsMap.get(request.project.projectId);
          const user = usersMap.get(request.userId);
          const availableBudget = project ? project.availableBudget : 0;
          const userName = user ? user.name : 'Desconhecido';

          return {
            ...request,
            availableBudget,
            cost: 0, 
            userName,
          };
        });

        setRequests(processedRequests);
      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 
  
  const handlePrint = () => {
    window.print();
  };

 
  const handleApprove = async (requestId) => {
    try {
      await axios.patch(`http://localhost:5028/api/Request/${requestId}/status`, {
        status: "Approved"
      });
      
      const updatedRequests = requests.map(req =>
        req.requestId === requestId ? { ...req, status: "Approved" } : req
      );
      setRequests(updatedRequests);
    } catch (err) {
      console.error(`Erro ao aprovar requisição ${requestId}:`, err);
      setError("Falha ao aprovar a requisição.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(`http://localhost:5028/api/Request/${requestId}/status`, {
        status: "Rejected"
      });
      
      const updatedRequests = requests.map(req =>
        req.requestId === requestId ? { ...req, status: "Rejected" } : req
      );
      setRequests(updatedRequests);
    } catch (err) {
      console.error(`Erro ao rejeitar requisição ${requestId}:`, err);
      setError("Falha ao rejeitar a requisição.");
    }
  };

  
  const handleShowDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsPopup(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsPopup(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return <div className="loading-message">A carregar dados...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="printable-dashboard-container">
      <h1 className="dashboard-title">Requisições Pendentes</h1>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Requisição</th>
            <th>Data de Ida</th>
            <th>Data de Retorno</th>
            <th>Custo</th>
            <th>Orçamento Disponível</th>
            <th className="action-column">Aprovar/Rejeitar</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.requestId}>
              <td>
                <a 
                  href="#" 
                  className="request-link"
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleShowDetails(request);
                  }}
                >
                  {request.requestId}
                </a>
                <br />
                <small>Utilizador: {request.userName}</small>
              </td>
              <td>{new Date(request.travelDate).toLocaleDateString()}</td>
              <td>{new Date(request.returnDate).toLocaleDateString()}</td>
              <td>€{request.cost.toFixed(2)}</td>
              <td>
                €{request.availableBudget.toFixed(2)}
                {request.cost > request.availableBudget && (
                  <span title="Orçamento Insuficiente" className="ms-2">
                    <i className="bi bi-exclamation-triangle-fill alert-icon"></i>
                    <span className="tooltip-text" style={{ display: 'none' }}>Orçamento Insuficiente</span>
                  </span>
                )}
              </td>
              <td className="action-column-buttons">
                {request.status.toLowerCase() === 'approved' ? (
                  <span className="badge bg-success">Aprovado</span>
                ) : request.status.toLowerCase() === 'rejected' ? (
                  <span className="badge bg-danger">Rejeitado</span>
                ) : (
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-success action-button"
                      onClick={() => handleApprove(request.requestId)}
                      title="Aprovar"
                    >
                      <i className="bi bi-check-lg"></i> Aprovar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger action-button"
                      onClick={() => handleReject(request.requestId)}
                      title="Rejeitar"
                    >
                      <i className="bi bi-x-lg"></i> Rejeitar
                    </button>
                  </div>
                )}
                {request.status.toLowerCase() === 'pending' && (
                  <span className="tooltip-text print-only-text" style={{ display: 'none' }}>
                    Pendente de Aprovação
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">
          Imprimir Dashboard
        </button>
      </div>

      {/* NOVO: Pop-up de detalhes da requisição */}
      {showDetailsPopup && selectedRequest && (
        <div className="request-details-modal-overlay">
          <div className="request-details-modal">
            <div className="modal-header">
              <h5 className="modal-title">Detalhes da Requisição #{selectedRequest.requestId}</h5>
              <button className="btn-close" onClick={handleCloseDetails}></button>
            </div>
            <div className="modal-body">
              <p><strong>Descrição:</strong> {selectedRequest.description}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Utilizador:</strong> {selectedRequest.userName}</p>
              <p><strong>Data de Partida:</strong> {new Date(selectedRequest.travelDate).toLocaleDateString()}</p>
              <p><strong>Data de Retorno:</strong> {new Date(selectedRequest.returnDate).toLocaleDateString()}</p>
              <p><strong>Origem:</strong> {selectedRequest.originCityName}</p>
              <p><strong>Destino:</strong> {selectedRequest.destinationCityName}</p>
              <p><strong>Precisa de Hotel:</strong> {selectedRequest.needHotel ? 'Sim' : 'Não'}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseDetails}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeManager;
