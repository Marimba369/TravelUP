import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/HomeFacilitator.css';
import { BiPlusCircle } from 'react-icons/bi';

const HomeFacilitator = () => {
  // Dados de exemplo
  const [newRequests, setNewRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    // Simulando dados da API
    const mockNewRequests = [
      { id: 'REQ001', createdBy: 'João Silva', travelDate: '2023-10-15', status: 'new' },
      { id: 'REQ002', createdBy: 'Maria Souza', travelDate: '2023-10-20', status: 'new' },
      { id: 'REQ003', createdBy: 'Carlos Oliveira', travelDate: '2023-11-05', status: 'new' },
    ];

    const mockPendingRequests = [
      { id: 'REQ004', createdBy: 'Ana Costa', travelDate: '2023-11-12', status: 'pending' },
      { id: 'REQ005', createdBy: 'Pedro Rocha', travelDate: '2023-11-18', status: 'pending' },
      { id: 'REQ006', createdBy: 'Fernanda Lima', travelDate: '2023-12-01', status: 'pending' },
    ];

    setNewRequests(mockNewRequests);
    setPendingRequests(mockPendingRequests);
  }, []);

  const handleAddQuote = (requestId) => {
    console.log(`Adicionar cotação à requisição ${requestId}`);
    // Lógica para adicionar cotação
    alert(`Adicionar cotação à requisição: ${requestId}`);
  };

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
              {newRequests.map(request => (
                <tr key={request.id}>
                  <td>
                    <Link to={`/requests/${request.id}`} className="request-link">
                      {request.id}
                    </Link>
                  </td>
                  <td>{request.createdBy}</td>
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
              {pendingRequests.map(request => (
                <tr key={request.id}>
                  <td>
                    <Link to={`/requests/${request.id}`} className="request-link">
                      {request.id}
                    </Link>
                  </td>
                  <td>{request.createdBy}</td>
                  <td>{new Date(request.travelDate).toLocaleDateString('pt-BR')}</td>
                  <td className="action-cell">
                    <button 
                      className="icon-button"
                      onClick={() => handleAddQuote(request.id)}
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
    </div>
  );
};

export default HomeFacilitator;