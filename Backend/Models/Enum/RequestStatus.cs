namespace TravelUp.Models.Enum;

public enum RequestStatus
{
    Draft,
    Submitted,
    WaitingForQuotes,
    QuotesAvailable,
    QuoteSelected,
    WaitingForApproval,
    Approved,
    Rejected,
    Cancelled
}