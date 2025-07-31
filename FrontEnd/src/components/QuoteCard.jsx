function QuoteCard({ item, onSelect, isSelected }) {
    const {
      quoteId,
      hotelName,
      flightName,
      cost,
      checkInDate,
      checkOutDate,
    } = item;
  
    const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-PT");
  
    return (
      <div
        className={`card m-2 shadow-sm ${isSelected ? "border-primary border-3" : ""}`}
        style={{ width: "18rem", cursor: "pointer" }}
        onClick={() => onSelect(item)}
      >
        <div className="card-body">
          <h5 className="card-title">Cotação #{quoteId}</h5>
          <p className="card-text">🏨 <strong>Hotel:</strong> {hotelName}</p>
          <p className="card-text">✈️ <strong>Voo:</strong> {flightName}</p>
          <p className="card-text">💰 <strong>Preço:</strong> €{cost.toFixed(2)}</p>
          <p className="card-text">
            📅 <strong>Período:</strong> {formatDate(checkInDate)} – {formatDate(checkOutDate)}
          </p>
        </div>
      </div>
    );
}

export default QuoteCard