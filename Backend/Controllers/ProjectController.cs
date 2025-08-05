using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.Models;
using TravelUp.DTOs;
using TravelUp.Service;

namespace TravelUp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ProjectImportService _projectImportService;

    public ProjectController(AppDbContext context, ProjectImportService projectImportService)
    {
        _context = context;
        _projectImportService = projectImportService;
    }

    /// <summary>
    /// Cria um novo projeto.
    /// </summary>
    /// <param name="dto">Dados do projeto a ser criado.</param>
    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto)
    {
        var project = new Project { Name = dto.Name, Description = dto.Description };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjectById), new { id = project.ProjectId }, project);
    }
    
    /// <summary>
    /// Obtém a lista de todos os projetos.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllProjects()
    {
        var projects = await _context.Projects.ToListAsync();
        return Ok(projects);
    }
    
    /// <summary>
    /// Obtém um projeto pelo ID.
    /// </summary>
    /// <param name="id">O ID do projeto.</param>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound();
        return Ok(project);
    }

    /// <summary>
    /// Atualiza um projeto existente.
    /// </summary>
    /// <param name="id">O ID do projeto a ser atualizado.</param>
    /// <param name="dto">Dados atualizados do projeto.</param>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectDto dto)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound();

        project.Name = dto.Name;
        project.Description = dto.Description;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Deleta um projeto.
    /// </summary>
    /// <param name="id">O ID do projeto a ser deletado.</param>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound();
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    /// <summary>
    /// Importa projetos a partir de um arquivo CSV.
    /// </summary>
    /// <param name="file">O arquivo CSV com os dados dos projetos.</param>
    [HttpPost("import")]
    public async Task<IActionResult> ImportProjects([FromForm] IFormFile file)
    {
        var (success, errors) = await _projectImportService.ImportFromCsvAsync(file);
        
        if (!success)
        {
            return BadRequest(new { errors });
        }
        
        return Ok("Projetos importados com sucesso.");
    }
}