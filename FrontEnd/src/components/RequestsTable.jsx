import React from 'react';
import "../style/RequestsTable.css"; 

const mockRequests = [
  {
    requestId: 1,
    description: "Viagem de negócios para São Paulo",
    status: "Approved",
    travelDate: "2018-01-05T00:00:00Z",
    returnDate: "2018-01-07T00:00:00Z",
    isRoundTrip: true,
    needHotel: false,
    originCityName: "Lisbon",
    destinationCityName: "Sao Paulo",
    project: {
      projectId: 101,
      name: "Project X"
    },
    userId: 1, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 2,
    description: "Reunião com clientes no Porto",
    status: "Draft",
    travelDate: "2018-01-15T00:00:00Z",
    returnDate: "2018-01-15T00:00:00Z",
    isRoundTrip: false,
    needHotel: true,
    originCityName: "Faro",
    destinationCityName: "Porto",
    project: {
      projectId: 101,
      name: "Project X"
    },
    userId: 2, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 3,
    description: "Conferência em Madrid",
    status: "Rejected",
    travelDate: "2018-01-27T00:00:00Z",
    returnDate: "2018-01-29T00:00:00Z",
    isRoundTrip: true,
    needHotel: false,
    originCityName: "Lisbon",
    destinationCityName: "Madrid",
    project: {
      projectId: 102,
      name: "Project Y"
    },
    userId: 1, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 4,
    description: "Treinamento em Berlim",
    status: "Canceled",
    travelDate: "2018-02-20T00:00:00Z",
    returnDate: "2018-02-21T00:00:00Z",
    isRoundTrip: true,
    needHotel: true,
    originCityName: "Porto",
    destinationCityName: "Berlin",
    project: {
      projectId: 101,
      name: "Project X"
    },
    userId: 3, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 5,
    description: "Visita técnica em Paris",
    status: "Waiting Quotes",
    travelDate: "2018-02-23T00:00:00Z",
    returnDate: "2018-02-26T00:00:00Z",
    isRoundTrip: true,
    needHotel: false,
    originCityName: "Lisbon",
    destinationCityName: "Paris",
    project: {
      projectId: 101,
      name: "Project X"
    },
    userId: 1, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 6,
    description: "Apresentação em Londres",
    status: "Waiting Quotes",
    travelDate: "2018-03-01T00:00:00Z",
    returnDate: null, // Sem data de retorno
    isRoundTrip: false,
    needHotel: true,
    originCityName: "Lisbon",
    destinationCityName: "London",
    project: {
      projectId: 103,
      name: "Project Z"
    },
    userId: 2, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 7,
    description: "Workshop em Roma",
    status: "Waiting Quotes",
    travelDate: "2018-04-01T00:00:00Z",
    returnDate: null, // Sem data de retorno
    isRoundTrip: false,
    needHotel: false,
    originCityName: "Porto",
    destinationCityName: "Rome",
    project: {
      projectId: 103,
      name: "Project Z"
    },
    userId: 3, // Exemplo de userId
    quotes: []
  },
  {
    requestId: 8,
    description: "Viagem de campo em Coimbra",
    status: "Waiting Quotes",
    travelDate: "2018-05-01T00:00:00Z",
    returnDate: "2018-05-01T00:00:00Z",
    isRoundTrip: true,
    needHotel: true,
    originCityName: "Lisbon",
    destinationCityName: "Coimbra",
    project: {
      projectId: 103,
      name: "Project Z"
    },
    userId: 1, // Exemplo de userId
    quotes: []
  },
];

function RequestsTable({ userRole, userId }) { 

  const handleNewRequest = () => {
    alert("Navegar para a página de Nova Requisição");
    // Aqui você implementaria a navegação para a página de criação de requisições
  };

  const handleRequestClick = (requestId) => {
    alert(`Clicou na requisição: ${requestId}`);
    // Aqui você implementaria a navegação para os detalhes da requisição
  };

  // Lógica de filtragem baseada no userRole
  const filteredRequests = mockRequests.filter(request => {
    if (userRole === 'Traveler') {
      return request.userId === userId;
    }
    // Para Facilitator, Manager ou qualquer outro role, mostra todas as requisições
    return true;
  });

  return (
    <div className="requests-table-container">
      <div className="requests-table-header">
        <h1 className="requests-table-title">Minhas Requisições ({userRole})</h1> {/* Mostra o cargo no título */}
        <button className="btn btn-primary btn-sm new-request-button" onClick={handleNewRequest}>
          Nova Requisição
        </button>
      </div>

      <table className="table table-striped table-hover requests-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Data de Ida</th>
            <th>Retorno</th>
            {userRole !== 'Traveler' && <th>Projeto</th>} {/* Condicional: mostra Projeto para não-Travelers */}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => ( // Usa as requisições filtradas
            <tr key={request.requestId}> {/* Usando requestId como chave */}
              <td>
                <a href="#" onClick={() => handleRequestClick(request.requestId)} className="request-code-link">
                  {request.requestId} {/* Exibe o requestId */}
                </a>
              </td>
              <td>{new Date(request.travelDate).toLocaleDateString()}</td> {/* Formata a data */}
              <td>{request.returnDate ? new Date(request.returnDate).toLocaleDateString() : '-'}</td> {/* Formata ou mostra '-' */}
              {userRole !== 'Traveler' && <td>{request.project?.name || 'N/A'}</td>} {/* Condicional para não-Travelers e verifica project */}
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequestsTable;