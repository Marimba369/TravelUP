// src/pages/Facilitator/PendingRequestsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
//import StatusBadge from '../../components/common/StatusBadge';

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
  Cancelled : "cancelled",
  WaitingForSelected: "waitingForSeleted"
})

function PendingRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests', {
          params: { status: StatusEnum.Submitted } // Status que o TravelerRequest define
        });
        setRequests(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mt-4">
      <h2>Solicitações Pendentes</h2>
      
      <div className="list-group mt-3">
        {requests.map(request => (
          <div key={request.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                <h5>Solicitação #{request.id}</h5>
                <p>
                  {request.originCity.name} → {request.destinationCity.name}
                </p>
              </div>
              <div>
                {/*<StatusBadge status={request.status} />*/}
                <Link 
                  to={`/facilitator/quote/${request.id}`}
                  className="btn btn-sm btn-primary ms-2"
                >
                  Adicionar Cotação
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingRequestsList;