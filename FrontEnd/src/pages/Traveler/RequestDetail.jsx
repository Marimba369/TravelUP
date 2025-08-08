import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/AuthProvider';

import '../../style/HomeManager.css';

const RequestDetail = () => {

    const { userId, user, role } = useAuth();

    const currentUserId = userId; 
    const isManager = role === "Manager" || role === "Facilitator";  

    const [requests, setRequests] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showQuotesPopup, setShowQuotesPopup] = useState(false);
    const [selectedRequestForQuotes, setSelectedRequestForQuotes] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsResponse, projectsResponse, usersResponse, quotesResponse] = await Promise.all([
                    axios.get('http://localhost:5028/api/request'),
                    axios.get('http://localhost:5028/api/Project'),
                    axios.get('http://localhost:5028/api/Users'),
                    axios.get('http://localhost:5028/api/quote'),
                ]);

                const projects = projectsResponse.data;
                const requestsData = requestsResponse.data;
                const users = usersResponse.data;
                const quotesData = quotesResponse.data;

                const projectsMap = new Map(projects.map(p => [p.id, p]));
                const usersMap = new Map(users.map(u => [u.userId, u]));

                const filteredRequests = isManager
                    ? requestsData
                    : requestsData.filter(req => req.userId === currentUserId);

                const processedRequests = filteredRequests.map(request => {
                    const project = projectsMap.get(request.project.projectId);
                    const user = usersMap.get(request.userId);
                    const availableBudget = project ? project.availableBudget : 0;
                    const userName = user ? user.name : 'Desconhecido';

                    const relatedQuotes = quotesData.filter(q => q.requestId === request.requestId);
                    const totalCost = relatedQuotes.reduce((sum, q) => sum + (q.totalQuote || 0), 0);

                    return {
                        ...request,
                        availableBudget,
                        cost: totalCost,
                        userName,
                        projectName: project ? project.name : 'Sem Projeto'
                    };
                });

                setRequests(processedRequests);
                setQuotes(quotesData);
            } catch (err) {
                console.error("Erro ao buscar dados da API:", err);
                setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewQuotes = (request) => {
        setSelectedRequestForQuotes(request);
        setShowQuotesPopup(true);
    };

    const handleCloseQuotesPopup = () => {
        setShowQuotesPopup(false);
        setSelectedRequestForQuotes(null);
    };

    const handleSelectQuote = async (requestId, quoteId) => {
        console.log(`Cotação ${quoteId} selecionada para o pedido ${requestId}!`);
        handleCloseQuotesPopup();
    };

    if (loading) {
        return <div className="loading-message">A carregar dados...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="printable-dashboard-container">
            <h1 className="dashboard-title">Pedidos de Viagem</h1>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Requisição</th>
                        <th>Usuário</th>
                        <th>Projeto</th>
                        <th>Data de Ida</th>
                        <th>Data de Retorno</th>
                        <th>Custo</th>
                        <th>Orçamento Disponível</th>
                        <th className="action-column">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.requestId}>
                            <td>{request.requestId}</td>
                            <td>{request.userName}</td>
                            <td>{request.projectName}</td>
                            <td>{new Date(request.travelDate).toLocaleDateString()}</td>
                            <td>{new Date(request.returnDate).toLocaleDateString()}</td>
                            <td>€{request.cost.toFixed(2)}</td>
                            <td>€{request.availableBudget.toFixed(2)}</td>
                            <td className="action-column-buttons">
                                {request.status === 'WaitingForSelected' ? (
                                    <button
                                        className="btn btn-sm btn-outline-primary action-button"
                                        onClick={() => handleViewQuotes(request)}
                                    >
                                        Ver Cotações
                                    </button>
                                ) : request.status === 'Approved' ? (
                                    <span className="badge bg-success">Aprovado</span>
                                ) : request.status === 'Rejected' ? (
                                    <span className="badge bg-danger">Rejeitado</span>
                                ) : (
                                    <span className="badge bg-secondary">{request.status}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pop-up de cotações */}
            {showQuotesPopup && selectedRequestForQuotes && (
                <div className="request-details-modal-overlay">
                    <div className="request-details-modal">
                        <div className="modal-header">
                            <h5 className="modal-title">Cotações para o Pedido #{selectedRequestForQuotes.requestId}</h5>
                            <button className="btn-close" onClick={handleCloseQuotesPopup}></button>
                        </div>
                        <div className="modal-body">
                            {quotes.filter(q => q.requestId === selectedRequestForQuotes.requestId).length > 0 ? (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Agência</th>
                                            <th>Total</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotes
                                            .filter(q => q.requestId === selectedRequestForQuotes.requestId)
                                            .map(quote => (
                                                <tr key={quote.quoteId}>
                                                    <td>Agência {quote.agencyId}</td>
                                                    <td>€{quote.totalQuote.toFixed(2)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleSelectQuote(selectedRequestForQuotes.requestId, quote.quoteId)}
                                                        >
                                                            Selecionar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Não há cotações disponíveis para este pedido.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseQuotesPopup}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestDetail;
