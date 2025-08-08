// Services/ProjectImportService.cs
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.Models;
using TravelUp.DTOs;
using System.Globalization; // 🚨 Adicionado: Importar para CultureInfo

namespace TravelUp.Service;

// 🚨 Adicionado: Definição do DTO para mapear as colunas do CSV
public class CsvProjectRecord
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Budget { get; set; }
}

public class ProjectImportService
{
    private readonly AppDbContext _context;

    public ProjectImportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(bool Success, List<string> Errors)> ImportFromCsvAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return (false, new List<string> { "O arquivo não foi fornecido." });
        }

        var errors = new List<string>();
        var newProjects = new List<Project>();

        using (var reader = new StreamReader(file.OpenReadStream()))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)))
        {
            try
            {
                // A biblioteca CsvHelper mapeia as colunas do CSV para este DTO
                var records = csv.GetRecords<CsvProjectRecord>().ToList();

                foreach (var record in records)
                {
                    if (string.IsNullOrWhiteSpace(record.Name))
                    {
                        errors.Add($"Linha {csv.Context.Parser.Row}: O nome do projeto não pode ser vazio.");
                        continue;
                    }

                    var project = new Project
                    {
                        Name = record.Name,
                        Description = record.Description,
                        // Mapeamento corrigido para o DTO
                        AvailableBudget = record.Budget
                    };
                    newProjects.Add(project);
                }

                if (errors.Any())
                {
                    return (false, errors);
                }

                await _context.Projects.AddRangeAsync(newProjects);
                await _context.SaveChangesAsync();

                return (true, new List<string>());
            }
            catch (HeaderValidationException ex)
            {
                return (false, new List<string> { $"Erro de validação do cabeçalho do CSV: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return (false, new List<string> { $"Ocorreu um erro ao processar o arquivo: {ex.Message}" });
            }
        }
    }
}