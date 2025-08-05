{/* Exibição de cotações */}
{showQuotes && agencyData && (
    <div className="mt-4">
      <h6 className="text-primary mb-3">
        Cotações de {agencyData.name}
        <button 
          className="btn btn-sm btn-outline-secondary float-end py-0"
          onClick={() => setShowQuotes(false)}
        >
          Fechar
        </button>
      </h6>

      {agencyData.quotes?.length > 0 ? (
        <QuoteList
          quotes={agencyData.quotes}
          selectedQuote={selectedQuote}
          onQuoteSelected={setSelectedQuote}
        />
      ) : (
        <div className="alert alert-warning text-center py-2 small">
          Nenhuma cotação disponível para esta agência
        </div>
      )}
    </div>
  )}