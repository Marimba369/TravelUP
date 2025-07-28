
using Microsoft.EntityFrameworkCore;
using TravelUp.Models; 

namespace TravelUp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets para cada entidade que você quer mapear para uma tabela no banco de dados
        public DbSet<User> User { get; set; }
        public DbSet<Request> Request { get; set; }
        public DbSet<Agency> Agencie { get; set; }
        public DbSet<Quote> Quote { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações de relacionamento usando Fluent API (opcional, mas bom para clareza e controle)

            // Relacionamento AppUser (1) para Request (N)
            modelBuilder.Entity<Request>()
                .HasOne(r => r.User)        // Uma Request tem Um User
                .WithMany(u => u.Requests)  // Um User tem Muitas Requests
                .HasForeignKey(r => r.UserId); // A chave estrangeira está em Request

            // Relacionamento Request (1) para Quote (N)
            modelBuilder.Entity<Quote>()
                .HasOne(q => q.Request)     // Uma Quote tem Uma Request
                .WithMany(r => r.Quote)    // Uma Request tem Muitas Quotes
                .HasForeignKey(q => q.RequestId); // A chave estrangeira está em Quote

            // Relacionamento Agency (1) para Quote (N)
            modelBuilder.Entity<Quote>()
                .HasOne(q => q.Agency)      // Uma Quote tem Uma Agency
                .WithMany(a => a.Quotes)    // Uma Agency tem Muitas Quotes
                .HasForeignKey(q => q.AgencyId); // A chave estrangeira está em Quote

            // Opcional: Configurar o enum para ser armazenado como string (por padrão é int)
            modelBuilder.Entity<Request>()
                .Property(r => r.Status)
                .HasConversion<string>(); // Armazena o enum como string no DB
        }
    }
}