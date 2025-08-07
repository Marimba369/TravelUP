import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

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


function PendingRequests() {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await api.get('/requests?status=WaitingForQuotes');
        setRequests(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };
    
    fetchPendingRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Pedidos Pendentes de Cotação</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Viajante</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.requestId}>
              <td>{request.requestId}</td>
              <td>{request.user.name}</td>
              <td>{request.originCity.name}</td>
              <td>{request.destinationCity.name}</td>
              <td>{new Date(request.travelDate).toLocaleDateString()}</td>
              <td>
                <Link 
                  to={`/facilitator/quote/${request.requestId}`}
                  className="btn btn-sm btn-primary"
                >
                  Adicionar Cotação
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingRequests;