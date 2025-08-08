import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../style/HomeFacilitator.css';
import { BiPlusCircle } from 'react-icons/bi';
import AddQuotes from './AddQuotes'; 

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

const HomeFacilitator = () => {
  const [newRequests, setNewRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAddQuotes, setShowAddQuotes] = useState(false); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5028/api/request'),
        axios.get('http://localhost:5028/api/Users')
      ]);

      const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [requestsRes.data];
      const newReqs = requests.filter(r => r.status === StatusEnum.QuoteSelected);
      const pendingReqs = requests.filter(r => r.status === StatusEnum.WaitingForQuotes);

      setNewRequests(newReqs);
      setPendingRequests(pendingReqs);

      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [usersRes.data];
      setUsers(usersData);
      
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserName = (userId) => {
    if (!users || !Array.isArray(users)) return '-';
    const user = users.find(u => u.userId === userId);
    return user ? user.name : '-';
  };

  const handleAddQuote = (request) => {
    setSelectedRequest(request);
    setShowAddQuotes(true);
  };
  
  const handleQuoteSubmitted = () => {
    // Esconder o componente AddQuotes e recarregar os dados
    setShowAddQuotes(false);
    setSelectedRequest(null);
    fetchData(); // Recarregar dados para atualizar as listas de requisições
  };

  const handleClear = () => {
    // Esconder o componente AddQuotes e limpar o estado
    setShowAddQuotes(false);
    setSelectedRequest(null);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  if (loading) return <p className="p-4">Carregando requisições...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (showAddQuotes && selectedRequest) {
    return (
      <AddQuotes
        travelRequestId={selectedRequest.requestId || selectedRequest.id}
        onQuoteSubmitted={handleQuoteSubmitted}
        onClear={handleClear}
      />
    );
  }

  return (
    <div className="requests-container">
      <h1 className="page-title">Requisições de Viagem</h1>

      <div className="tables-container">
        {/* Tabela New Requests */}
        <div className="requests-table">
          <div className="table-header">
            <h2 className="table-title">New Requests</h2>
            <span className="badge">{newRequests.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Solicitante</th>
                <th>Data da Viagem</th>
              </tr>
            </thead>
            <tbody>
              {newRequests.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Sem novas requisições</td></tr>
              ) : newRequests.map(request => (
                <tr key={request.requestId || request.id}>
                  <td>
                    <button
                      className="request-link"
                      onClick={() => openModal(request)}
                    >
                      {request.requestId || request.id}
                    </button>
                  </td>
                  <td>{getUserName(request.createdBy || request.userId)}</td>
                  <td>{new Date(request.travelDate).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabela Pending Requests */}
        <div className="requests-table">
          <div className="table-header">
            <h2 className="table-title">Pending Requests</h2>
            <span className="badge badge-warning">{pendingRequests.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Solicitante</th>
                <th>Data da Viagem</th>
                <th>Adicionar Cotação</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Sem requisições pendentes</td></tr>
              ) : pendingRequests.map(request => (
                <tr key={request.requestId || request.id}>
                  <td>
                    <button
                      className="request-link"
                      onClick={() => openModal(request)}
                    >
                      {request.requestId || request.id}
                    </button>
                  </td>
                  <td>{getUserName(request.createdBy || request.userId)}</td>
                  <td>{new Date(request.travelDate).toLocaleDateString('pt-BR')}</td>
                  <td className="action-cell">
                    <button
                      className="icon-button"
                      onClick={() => handleAddQuote(request)}
                      title="Adicionar cotação"
                    >
                      <BiPlusCircle className="add-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalhes da requisição */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detalhes da Requisição</h2>
            <p><strong>Código:</strong> {selectedRequest.requestId || selectedRequest.id}</p>
            <p><strong>Solicitante:</strong> {getUserName(selectedRequest.createdBy || selectedRequest.userId)}</p>
            <p><strong>Data da Viagem:</strong> {new Date(selectedRequest.travelDate).toLocaleDateString('pt-BR')}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Cidade de Destino:</strong> {selectedRequest.destinationCityName || '-'}</p>
            <p><strong>Descrição:</strong> {selectedRequest.description || '-'}</p>
            <button className="close-button" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeFacilitator;