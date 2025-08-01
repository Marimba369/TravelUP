import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style/QuoteList.css";

function QuoteList({ quotes, selectedQuote, onQuoteSelected }) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    return <p>Nenhuma cotação disponível.</p>;
  }

  return (
    <div className="quote-list list-group">
      <AnimatePresence>
        {quotes.map((quote) => (
          <motion.button
            key={quote.quoteId}
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
              selectedQuote?.quoteId === quote.quoteId ? "active" : ""
            }`}
            onClick={() => onQuoteSelected(quote)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <strong>{quote.hotelName || "Hotel"}</strong><br />
              <small>Voo: {quote.flightName || "N/A"}</small><br />
              <small>
                Preço:{" "}
                {typeof quote.cost === "number"
                  ? `€${quote.cost.toFixed(2)}`
                  : "Não disponível"}
              </small><br />
              <small>
                Check-in:{" "}
                {quote.checkInDate
                  ? new Date(quote.checkInDate).toLocaleDateString()
                  : "N/A"}
              </small><br />
              <small>
                Check-out:{" "}
                {quote.checkOutDate
                  ? new Date(quote.checkOutDate).toLocaleDateString()
                  : "N/A"}
              </small>
            </div>
            <i className="bi bi-chevron-right"></i>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default QuoteList;
