using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TravelUp.Models;
using TravelUp.Models.Enum;

namespace TravelUp.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Agency> Agencies { get; set; }
    public DbSet<Quote> Quotes { get; set; }
    public DbSet<Request> Requests { get; set; }
    public DbSet<Users> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Relação 1:N - User -> Requests
        modelBuilder.Entity<Users>()
            .HasMany(u => u.Requests)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relação 1:N - Request -> Quotes
        modelBuilder.Entity<Request>()
            .HasMany(r => r.Quotes)
            .WithOne(q => q.Request)
            .HasForeignKey(q => q.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relação 1:N - Agency -> Quotes
        modelBuilder.Entity<Agency>()
            .HasMany(a => a.Quotes)
            .WithOne(q => q.Agency)
            .HasForeignKey(q => q.AgencyId)
            .OnDelete(DeleteBehavior.Cascade);

        // change DateTime properties to UTC 
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

        base.OnModelCreating(modelBuilder);
    }
}
