import React from "react";
import QuoteCard from "./QuoteCard";

function QuoteList({ quotes, selectedQuote, onQuoteSelected }) {
  return (
    <div className="d-flex flex-wrap justify-content-start">
      {quotes.map((quote) => (
        <QuoteCard
          key={quote.quoteId}
          item={quote}
          onSelect={onQuoteSelected}
          isSelected={selectedQuote?.quoteId === quote.quoteId}
        />
      ))}
    </div>
  );
}

export default QuoteList;