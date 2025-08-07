
//Enums dos diferentes estados da requisição

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
    Cancelled : "cancelled"
})

export default statusbar;