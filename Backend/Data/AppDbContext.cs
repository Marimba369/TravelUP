using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TravelUp.Models;

namespace TravelUp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // DbSets para todas as entidades principais da aplicação.
    public DbSet<Users> Users { get; set; } = null!;
    public DbSet<Request> Requests { get; set; } = null!;
    public DbSet<Quote> Quotes { get; set; } = null!; // Quote re-adicionado ao DbContext
    public DbSet<QuoteItem> QuoteItems { get; set; } = null!;
    public DbSet<QuoteFlight> QuoteFlights { get; set; } = null!;
    public DbSet<QuoteHotel> QuoteHotels { get; set; } = null!;
    public DbSet<Agency> Agencies { get; set; } = null!;

    public DbSet<Country> Countries { get; set; }
    public DbSet<City> Cities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Altera todas as propriedades DateTime para UTC para garantir a consistência.
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties()
                .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))
            {
                property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                ));
            }
        }

        // --- Configuração dos relacionamentos entre as entidades ---

        // Um User pode ter muitas Requests.
        modelBuilder.Entity<Request>()
            .HasOne(r => r.User)
            .WithMany(u => u.Requests)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Um Request pode ter muitos Quotes.
        modelBuilder.Entity<Quote>()
            .HasOne(q => q.Request)
            .WithMany(r => r.Quotes)
            .HasForeignKey(q => q.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        // Um Quote é associado a uma única Agency.
        modelBuilder.Entity<Quote>()
            .HasOne(q => q.Agency)
            .WithMany(a => a.Quotes)
            .HasForeignKey(q => q.AgencyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Um Quote pode ter muitos QuoteItems (sejam eles voos ou hotéis).
        modelBuilder.Entity<QuoteItem>()
            .HasOne(qi => qi.Quote)
            .WithMany(q => q.Items)
            .HasForeignKey(qi => qi.QuoteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configura a relação para a cidade de origem
        modelBuilder.Entity<Request>()
            .HasOne(r => r.OriginCity)
            .WithMany(c => c.OriginRequests) // Crie esta propriedade em City
            .HasForeignKey(r => r.OriginCityId)
            .OnDelete(DeleteBehavior.Restrict); // Evita a exclusão em cascata

        // Configura a relação para a cidade de destino
        modelBuilder.Entity<Request>()
            .HasOne(r => r.DestinationCity)
            .WithMany(c => c.DestinationRequests) // Crie esta propriedade em City
            .HasForeignKey(r => r.DestinationCityId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}
