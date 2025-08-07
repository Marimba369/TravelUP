import React from 'react';
import '../style/HomeManager.css'; // Importa o CSS de um arquivo externo

function HomeManager() {
  const requests = [
    {
      id: "2018/00001",
      user: "José João",
      travelDate: "2018-01-05",
      returnDate: "2018-01-06",
      cost: 550.0,
      availableBudget: 700.0,
      status: "approved"
    },
    {
      id: "2018/00005",
      user: "Trish Voyager",
      travelDate: "2018-01-15",
      returnDate: "2018-01-18",
      cost: 1000.0,
      availableBudget: 700.0,
      status: "pending"
    },
    {
      id: "2018/00009",
      user: "Frank Helper",
      travelDate: "2018-01-27",
      returnDate: "2018-01-29",
      cost: 2550.0,
      availableBudget: 1500.0,
      status: "rejected"
    },
    {
      id: "2018/00027",
      user: "José João",
      travelDate: "2018-02-23",
      returnDate: "2018-02-26",
      cost: 1000.0,
      availableBudget: 500.0,
      status: "pending"
    },
    {
      id: "2017/00019",
      user: "Mary Decisor",
      travelDate: "2018-03-15",
      returnDate: "2018-03-15",
      cost: 550.0,
      availableBudget: 1500.0,
      status: "approved"
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = (requestId) => {
    alert(`Requisição ${requestId} Aprovada!`);
  };

  const handleReject = (requestId) => {
    alert(`Requisição ${requestId} Rejeitada!`);
  };

  return (
    <div className="printable-dashboard-container">
      <h1 className="dashboard-title">Requisições Pendentes</h1>
      <table className="dashboard-table">
        <thead><tr>
          <th>Requisição</th>
          <th>Data de Ida</th>
          <th>Data de Retorno</th>
          <th>Custo</th>
          <th>Orçamento Disponível</th>
          <th className="action-column">Aprovar/Rejeitar</th>
        </tr></thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>
                <a href="#" className="request-link">{request.id}</a><br />
                <small>{request.user}</small>
              </td>
              <td>{request.travelDate}</td>
              <td>{request.returnDate}</td>
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
                {request.status === 'approved' ? (
                  <span className="badge bg-success">Aprovado</span>
                ) : request.status === 'rejected' ? (
                  <span className="badge bg-danger">Rejeitado</span>
                ) : (
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-success action-button"
                      onClick={() => handleApprove(request.id)}
                      title="Aprovar"
                    >
                      <i className="bi bi-check-lg"></i> Aprovar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger action-button"
                      onClick={() => handleReject(request.id)}
                      title="Rejeitar"
                    >
                      <i className="bi bi-x-lg"></i> Rejeitar
                    </button>
                  </div>
                )}
                {request.status === 'pending' && (
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
    </div>
  );
}

export default HomeManager;