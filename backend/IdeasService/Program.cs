using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using IdeasService;
using IdeasService.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure port to 5002 for the Ideas/Workflow Service
builder.WebHost.UseUrls("http://localhost:5002");

// Register DbContext with SQLite
builder.Services.AddDbContext<IdeasDbContext>(options =>
    options.UseSqlite("Data Source=ideas.db"));

// Configure JSON serialization options
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Add CORS services
builder.Services.AddCors();

var app = builder.Build();

// Enable CORS
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

// Seed database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<IdeasDbContext>();
    IdeasDbContext.SeedDatabase(dbContext);
}

// Map flat Idea model to response DTO
IdeaResponse MapToDto(Idea i)
{
    var teamObj = new object();
    if (!string.IsNullOrEmpty(i.TeamCompositionJson))
    {
        try
        {
            teamObj = JsonSerializer.Deserialize<object>(i.TeamCompositionJson);
        }
        catch {}
    }

    return new IdeaResponse
    {
        Id = i.Id,
        Title = i.Title,
        Category = i.Category,
        Department = i.Department,
        Stage = i.Stage,
        Status = i.Status,
        DateSubmitted = i.DateSubmitted,
        LastUpdated = i.LastUpdated,
        SubmitterName = i.SubmitterName,
        SubmitterEmail = i.SubmitterEmail,
        SubmissionType = i.SubmissionType,
        Individual = new IndividualDto
        {
            FullName = i.IndividualFullName,
            Email = i.IndividualEmail,
            BusinessUnit = i.IndividualBusinessUnit,
            DutyStation = i.IndividualDutyStation,
            Age = i.IndividualAge,
            Gender = i.IndividualGender,
            JobRank = i.IndividualJobRank
        },
        TeamComposition = teamObj ?? new object(),
        ExecutiveSummary = i.ExecutiveSummary,
        ProblemOrOpportunity = i.ProblemOrOpportunity,
        ProposedSolution = i.ProposedSolution,
        StrategicObjective = i.StrategicObjective,
        InnovationCategory = i.InnovationCategory,
        SdgContribution = i.SdgContribution,
        ExpectedBenefits = i.ExpectedBenefits,
        KeyEnablers = i.KeyEnablers,
        ImplementationApproach = i.ImplementationApproach,
        ExpectedImpactIndicators = i.ExpectedImpactIndicators,
        PotentialRisks = i.PotentialRisks,
        Reviewer = i.Reviewer,
        ReviewDeadline = i.ReviewDeadline,
        ReviewSlaStatus = i.ReviewSlaStatus,
        Comments = i.Comments.Select(c => new CommentDto
        {
            Author = c.Author,
            AuthorRole = c.AuthorRole,
            Timestamp = c.Timestamp,
            Text = c.Text
        }).ToList(),
        Attachments = i.Attachments.Select(a => new AttachmentDto
        {
            Name = a.Name,
            Type = a.Type,
            Size = a.Size
        }).ToList(),
        ApprovalWorkflow = i.ApprovalWorkflow.Select(w => new ApprovalWorkflowStepDto
        {
            Step = w.Step,
            Status = w.Status
        }).ToList(),
        Timeline = i.Timeline.Select(t => new TimelineEntryDto
        {
            Stage = t.Stage,
            Date = t.Date
        }).ToList(),
        ProgressStages = BuildProgressStages(i.Stage)
    };
}

List<ProgressStageDto> BuildProgressStages(string currentStage)
{
    var stagesList = new[] { "Submitted", "Concept Development", "Experimentation", "Deployment", "Closed" };
    var result = new List<ProgressStageDto>();

    int currentIndex = Array.IndexOf(stagesList, currentStage);
    if (currentIndex == -1) currentIndex = 0;

    for (int i = 0; i < stagesList.Length; i++)
    {
        result.Add(new ProgressStageDto
        {
            Name = stagesList[i],
            Completed = i < currentIndex,
            Active = i == currentIndex
        });
    }

    return result;
}

// GET /api/ideas
app.MapGet("/api/ideas", async (IdeasDbContext dbContext, HttpContext context) =>
{
    var query = dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .AsQueryable();

    var status = context.Request.Query["status"].ToString();
    if (!string.IsNullOrEmpty(status))
    {
        query = query.Where(i => i.Status == status);
    }

    var category = context.Request.Query["category"].ToString();
    if (!string.IsNullOrEmpty(category))
    {
        query = query.Where(i => i.Category == category);
    }

    var department = context.Request.Query["department"].ToString();
    if (!string.IsNullOrEmpty(department))
    {
        query = query.Where(i => i.Department == department);
    }

    var submitterEmail = context.Request.Query["submitterEmail"].ToString();
    if (!string.IsNullOrEmpty(submitterEmail))
    {
        query = query.Where(i => i.SubmitterEmail == submitterEmail);
    }

    var search = context.Request.Query["search"].ToString();
    if (!string.IsNullOrEmpty(search))
    {
        var s = search.ToLower();
        query = query.Where(i => i.Title.ToLower().Contains(s) || i.SubmitterName.ToLower().Contains(s));
    }

    var list = await query.ToListAsync();
    var dtoList = list.Select(MapToDto).ToList();
    return Results.Ok(dtoList);
});

// GET /api/ideas/{id}
app.MapGet("/api/ideas/{id:int}", async (IdeasDbContext dbContext, int id) =>
{
    var idea = await dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .FirstOrDefaultAsync(i => i.Id == id);

    if (idea == null)
    {
        return Results.NotFound(new { error = "Idea not found." });
    }

    return Results.Ok(MapToDto(idea));
});

// GET /api/ideas/mine
app.MapGet("/api/ideas/mine", async (IdeasDbContext dbContext, HttpContext context) =>
{
    var email = context.Request.Query["email"].ToString();
    if (string.IsNullOrEmpty(email))
    {
        email = context.Request.Headers["X-User-Email"].ToString();
    }

    if (string.IsNullOrEmpty(email))
    {
        return Results.BadRequest(new { error = "Email query parameter or header is required." });
    }

    var list = await dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .Where(i => i.SubmitterEmail == email)
        .ToListAsync();

    var dtoList = list.Select(MapToDto).ToList();
    return Results.Ok(dtoList);
});

// POST /api/ideas
app.MapPost("/api/ideas", async (IdeasDbContext dbContext, IdeaCreateRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.ExecutiveSummary))
    {
        return Results.BadRequest(new { error = "Title and Executive Summary are required." });
    }

    // Determine unique ID
    int nextId = 1;
    if (await dbContext.Ideas.AnyAsync())
    {
        nextId = await dbContext.Ideas.MaxAsync(i => i.Id) + 1;
    }

    var idea = new Idea
    {
        Id = nextId,
        Title = request.Title,
        Category = request.Category,
        Department = request.Department,
        Stage = "Submitted",
        Status = "Submitted",
        DateSubmitted = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        SubmitterName = request.SubmitterName,
        SubmitterEmail = request.SubmitterEmail,
        SubmissionType = request.SubmissionType,
        ExecutiveSummary = request.ExecutiveSummary,
        ProblemOrOpportunity = request.ProblemOrOpportunity,
        ProposedSolution = request.ProposedSolution,
        StrategicObjective = request.StrategicObjective,
        InnovationCategory = request.InnovationCategory,
        SdgContribution = request.SdgContribution,
        ExpectedBenefits = request.ExpectedBenefits,
        KeyEnablers = request.KeyEnablers,
        ImplementationApproach = request.ImplementationApproach,
        ExpectedImpactIndicators = request.ExpectedImpactIndicators,
        PotentialRisks = request.PotentialRisks,
        IsLocked = false,
        StageEnteredAtUtc = DateTime.UtcNow,
        CreatedAtUtc = DateTime.UtcNow
    };

    if (request.Individual != null)
    {
        idea.IndividualFullName = request.Individual.FullName;
        idea.IndividualEmail = request.Individual.Email;
        idea.IndividualBusinessUnit = request.Individual.BusinessUnit;
        idea.IndividualDutyStation = request.Individual.DutyStation;
        idea.IndividualAge = request.Individual.Age;
        idea.IndividualGender = request.Individual.Gender;
        idea.IndividualJobRank = request.Individual.JobRank;
    }

    if (request.TeamComposition != null)
    {
        idea.TeamCompositionJson = JsonSerializer.Serialize(request.TeamComposition);
    }

    idea.Timeline = new List<TimelineEntry>
    {
        new TimelineEntry { Stage = "Submitted", Date = DateTime.UtcNow.ToString("yyyy-MM-dd") }
    };

    idea.ApprovalWorkflow = new List<ApprovalWorkflowStep>
    {
        new ApprovalWorkflowStep { Step = "Initial Review", Status = "Pending" },
        new ApprovalWorkflowStep { Step = "Manager Approval", Status = "Not Started" },
        new ApprovalWorkflowStep { Step = "DDIPS Review", Status = "Not Started" },
        new ApprovalWorkflowStep { Step = "Final Approval", Status = "Not Started" }
    };

    dbContext.Ideas.Add(idea);
    await dbContext.SaveChangesAsync();

    return Results.Json(MapToDto(idea), statusCode: 201);
});

// PUT /api/ideas/{id}
app.MapPut("/api/ideas/{id:int}", async (IdeasDbContext dbContext, int id, IdeaUpdateRequest request) =>
{
    var idea = await dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .FirstOrDefaultAsync(i => i.Id == id);

    if (idea == null)
    {
        return Results.NotFound(new { error = "Idea not found." });
    }

    if (idea.IsLocked)
    {
        return Results.Json(new { error = "Idea is locked under active review and cannot be edited." }, statusCode: 409);
    }

    // Apply updates
    idea.Title = request.Title ?? idea.Title;
    idea.Category = request.Category ?? idea.Category;
    idea.Department = request.Department ?? idea.Department;
    idea.ExecutiveSummary = request.ExecutiveSummary ?? idea.ExecutiveSummary;
    idea.ProblemOrOpportunity = request.ProblemOrOpportunity ?? idea.ProblemOrOpportunity;
    idea.ProposedSolution = request.ProposedSolution ?? idea.ProposedSolution;
    idea.StrategicObjective = request.StrategicObjective ?? idea.StrategicObjective;
    idea.InnovationCategory = request.InnovationCategory ?? idea.InnovationCategory;
    idea.SdgContribution = request.SdgContribution ?? idea.SdgContribution;
    idea.ExpectedBenefits = request.ExpectedBenefits ?? idea.ExpectedBenefits;
    idea.KeyEnablers = request.KeyEnablers ?? idea.KeyEnablers;
    idea.ImplementationApproach = request.ImplementationApproach ?? idea.ImplementationApproach;
    idea.ExpectedImpactIndicators = request.ExpectedImpactIndicators ?? idea.ExpectedImpactIndicators;
    idea.PotentialRisks = request.PotentialRisks ?? idea.PotentialRisks;
    idea.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");

    await dbContext.SaveChangesAsync();
    return Results.Ok(MapToDto(idea));
});

// POST /api/ideas/{id}/retract
app.MapPost("/api/ideas/{id:int}/retract", async (IdeasDbContext dbContext, int id) =>
{
    var idea = await dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .FirstOrDefaultAsync(i => i.Id == id);

    if (idea == null) return Results.NotFound(new { error = "Idea not found." });

    if (idea.Status == "Retracted" || idea.Status == "Cancelled")
    {
        return Results.BadRequest(new { error = "Idea is already in a terminal status." });
    }

    var oldStatus = idea.Status;
    idea.Status = "Retracted";
    idea.IsLocked = true;
    idea.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");

    var history = new StageHistory
    {
        IdeaId = idea.Id,
        FromStage = idea.Stage,
        ToStage = idea.Stage,
        FromStatus = oldStatus,
        ToStatus = idea.Status,
        ChangedByUsername = idea.SubmitterName,
        Note = "Idea retracted by submitter.",
        ChangedAtUtc = DateTime.UtcNow
    };
    dbContext.StageHistories.Add(history);

    await dbContext.SaveChangesAsync();
    return Results.Ok(MapToDto(idea));
});

// POST /api/ideas/{id}/cancel
app.MapPost("/api/ideas/{id:int}/cancel", async (IdeasDbContext dbContext, int id) =>
{
    var idea = await dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .FirstOrDefaultAsync(i => i.Id == id);

    if (idea == null) return Results.NotFound(new { error = "Idea not found." });

    if (idea.Status == "Retracted" || idea.Status == "Cancelled")
    {
        return Results.BadRequest(new { error = "Idea is already in a terminal status." });
    }

    var oldStatus = idea.Status;
    idea.Status = "Cancelled";
    idea.IsLocked = true;
    idea.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");

    var history = new StageHistory
    {
        IdeaId = idea.Id,
        FromStage = idea.Stage,
        ToStage = idea.Stage,
        FromStatus = oldStatus,
        ToStatus = idea.Status,
        ChangedByUsername = "Innovation Team",
        Note = "Idea cancelled by Innovation Team.",
        ChangedAtUtc = DateTime.UtcNow
    };
    dbContext.StageHistories.Add(history);

    await dbContext.SaveChangesAsync();
    return Results.Ok(MapToDto(idea));
});

// PUT /api/ideas/{id}/review
app.MapPut("/api/ideas/{id:int}/review", async (IdeasDbContext dbContext, int id, ReviewRequest request) =>
{
    var idea = await dbContext.Ideas
        .Include(i => i.Comments)
        .Include(i => i.Attachments)
        .Include(i => i.ApprovalWorkflow)
        .Include(i => i.Timeline)
        .FirstOrDefaultAsync(i => i.Id == id);

    if (idea == null) return Results.NotFound(new { error = "Idea not found." });

    var oldStage = idea.Stage;
    var oldStatus = idea.Status;

    if (request.Decision.Equals("Approve", StringComparison.OrdinalIgnoreCase))
    {
        // sequential stage transitions: Submitted -> Concept Development -> Experimentation -> Deployment -> Closed
        if (idea.Stage.Equals("Submitted", StringComparison.OrdinalIgnoreCase))
        {
            idea.Stage = "Concept Development";
            idea.Status = "Under Review";
            // Update workflow
            var step = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "Initial Review");
            if (step != null) step.Status = "Complete";
            var nextStep = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "Manager Approval");
            if (nextStep != null) nextStep.Status = "Pending";
        }
        else if (idea.Stage.Equals("Concept Development", StringComparison.OrdinalIgnoreCase))
        {
            idea.Stage = "Experimentation";
            idea.Status = "Under Review";
            var step = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "Manager Approval");
            if (step != null) step.Status = "Complete";
            var nextStep = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "DDIPS Review");
            if (nextStep != null) nextStep.Status = "Pending";
        }
        else if (idea.Stage.Equals("Experimentation", StringComparison.OrdinalIgnoreCase))
        {
            idea.Stage = "Deployment";
            idea.Status = "Approved";
            var step = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "DDIPS Review");
            if (step != null) step.Status = "Complete";
            var nextStep = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "Final Approval");
            if (nextStep != null) nextStep.Status = "Pending";
        }
        else if (idea.Stage.Equals("Deployment", StringComparison.OrdinalIgnoreCase))
        {
            idea.Stage = "Closed";
            idea.Status = "Approved";
            var step = idea.ApprovalWorkflow.FirstOrDefault(w => w.Step == "Final Approval");
            if (step != null) step.Status = "Complete";
        }

        idea.IsLocked = true;
        idea.StageEnteredAtUtc = DateTime.UtcNow;

        // Add timeline entry
        idea.Timeline.Add(new TimelineEntry
        {
            Stage = idea.Stage,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd")
        });
    }
    else if (request.Decision.Equals("Decline", StringComparison.OrdinalIgnoreCase))
    {
        idea.Status = "Declined";
        idea.IsLocked = true;
        // set currently pending step to Declined
        var pendingStep = idea.ApprovalWorkflow.FirstOrDefault(w => w.Status == "Pending");
        if (pendingStep != null) pendingStep.Status = "Declined";
    }
    else if (request.Decision.Equals("RequestInfo", StringComparison.OrdinalIgnoreCase))
    {
        idea.Status = "Pending Information";
        idea.IsLocked = false; // unlocks for editing!
    }

    idea.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");

    // Add Comment if note exists
    if (!string.IsNullOrWhiteSpace(request.Note))
    {
        idea.Comments.Add(new Comment
        {
            Author = request.ReviewerName ?? "Innovation Team",
            AuthorRole = "Innovation Team",
            Timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            Text = request.Note
        });
    }

    // Add Stage History Row
    var history = new StageHistory
    {
        IdeaId = idea.Id,
        FromStage = oldStage,
        ToStage = idea.Stage,
        FromStatus = oldStatus,
        ToStatus = idea.Status,
        ChangedByUsername = request.ReviewerName ?? "Innovation Team",
        Note = request.Note,
        ChangedAtUtc = DateTime.UtcNow
    };
    dbContext.StageHistories.Add(history);

    await dbContext.SaveChangesAsync();
    return Results.Ok(MapToDto(idea));
});

// GET /api/ideas/{id}/comments
app.MapGet("/api/ideas/{id:int}/comments", async (IdeasDbContext dbContext, int id) =>
{
    var list = await dbContext.Comments
        .Where(c => c.IdeaId == id)
        .ToListAsync();

    var dtoList = list.Select(c => new CommentDto
    {
        Author = c.Author,
        AuthorRole = c.AuthorRole,
        Timestamp = c.Timestamp,
        Text = c.Text
    }).ToList();

    return Results.Ok(dtoList);
});

// POST /api/ideas/{id}/comments
app.MapPost("/api/ideas/{id:int}/comments", async (IdeasDbContext dbContext, int id, CommentCreateRequest request) =>
{
    var idea = await dbContext.Ideas.FindAsync(id);
    if (idea == null) return Results.NotFound(new { error = "Idea not found." });

    var comment = new Comment
    {
        IdeaId = id,
        Author = request.Author ?? "Anonymous",
        AuthorRole = request.AuthorRole ?? "Staff",
        Timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        Text = request.Text ?? string.Empty
    };

    dbContext.Comments.Add(comment);
    await dbContext.SaveChangesAsync();

    var dto = new CommentDto
    {
        Author = comment.Author,
        AuthorRole = comment.AuthorRole,
        Timestamp = comment.Timestamp,
        Text = comment.Text
    };

    return Results.Json(dto, statusCode: 201);
});

// POST /api/ideas/{id}/attachments
app.MapPost("/api/ideas/{id:int}/attachments", async (IdeasDbContext dbContext, int id, HttpContext context) =>
{
    var idea = await dbContext.Ideas.FindAsync(id);
    if (idea == null) return Results.NotFound(new { error = "Idea not found." });

    if (!context.Request.HasFormContentType)
    {
        return Results.BadRequest(new { error = "Request must be form-data." });
    }

    var form = await context.Request.ReadFormAsync();
    var file = form.Files.FirstOrDefault();
    if (file == null || file.Length == 0)
    {
        return Results.BadRequest(new { error = "No file uploaded." });
    }

    var attachment = new Attachment
    {
        IdeaId = id,
        Name = file.FileName,
        Type = file.ContentType,
        Size = file.Length,
        StoragePath = "uploads/" + Guid.NewGuid().ToString("N") + Path.GetExtension(file.FileName)
    };

    dbContext.Attachments.Add(attachment);
    await dbContext.SaveChangesAsync();

    var dto = new AttachmentDto
    {
        Name = attachment.Name,
        Type = attachment.Type,
        Size = attachment.Size
    };

    return Results.Json(dto, statusCode: 201);
});

// GET /api/categories
app.MapGet("/api/categories", async (IdeasDbContext dbContext) =>
{
    var list = await dbContext.Categories.ToListAsync();
    return Results.Ok(list);
});

// POST /api/categories
app.MapPost("/api/categories", async (IdeasDbContext dbContext, Category category) =>
{
    if (string.IsNullOrWhiteSpace(category.Name))
    {
        return Results.BadRequest(new { error = "Category Name is required." });
    }

    int nextId = 1;
    if (await dbContext.Categories.AnyAsync())
    {
        nextId = await dbContext.Categories.MaxAsync(c => c.Id) + 1;
    }

    category.Id = nextId;
    category.IsActive = true;

    dbContext.Categories.Add(category);
    await dbContext.SaveChangesAsync();

    return Results.Json(category, statusCode: 201);
});

// PUT /api/categories/{id}
app.MapPut("/api/categories/{id:int}", async (IdeasDbContext dbContext, int id, Category categoryUpdate) =>
{
    var cat = await dbContext.Categories.FindAsync(id);
    if (cat == null) return Results.NotFound(new { error = "Category not found." });

    cat.Name = categoryUpdate.Name ?? cat.Name;
    cat.Description = categoryUpdate.Description ?? cat.Description;
    cat.IsActive = categoryUpdate.IsActive;

    await dbContext.SaveChangesAsync();
    return Results.Ok(cat);
});

// DELETE /api/categories/{id} (soft delete)
app.MapDelete("/api/categories/{id:int}", async (IdeasDbContext dbContext, int id) =>
{
    var cat = await dbContext.Categories.FindAsync(id);
    if (cat == null) return Results.NotFound(new { error = "Category not found." });

    cat.IsActive = false; // Soft-delete category as required
    await dbContext.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

// Data Transfer Objects
public record IdeaCreateRequest(
    string Title,
    string Category,
    string Department,
    string SubmitterName,
    string SubmitterEmail,
    string SubmissionType,
    IndividualDto? Individual,
    object? TeamComposition,
    string ExecutiveSummary,
    string ProblemOrOpportunity,
    string ProposedSolution,
    string StrategicObjective,
    string InnovationCategory,
    string SdgContribution,
    string ExpectedBenefits,
    string KeyEnablers,
    string ImplementationApproach,
    string ExpectedImpactIndicators,
    string? PotentialRisks
);

public record IdeaUpdateRequest(
    string? Title,
    string? Category,
    string? Department,
    string? ExecutiveSummary,
    string? ProblemOrOpportunity,
    string? ProposedSolution,
    string? StrategicObjective,
    string? InnovationCategory,
    string? SdgContribution,
    string? ExpectedBenefits,
    string? KeyEnablers,
    string? ImplementationApproach,
    string? ExpectedImpactIndicators,
    string? PotentialRisks
);

public record ReviewRequest(string Decision, string? Note, string? ReviewerName);
public record CommentCreateRequest(string? Author, string? AuthorRole, string? Text);

public class IdeaResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string DateSubmitted { get; set; } = string.Empty;
    public string LastUpdated { get; set; } = string.Empty;
    public string SubmitterName { get; set; } = string.Empty;
    public string SubmitterEmail { get; set; } = string.Empty;
    public string SubmissionType { get; set; } = "individual";
    public IndividualDto Individual { get; set; } = new();
    public object TeamComposition { get; set; } = new object();
    public string ExecutiveSummary { get; set; } = string.Empty;
    public string ProblemOrOpportunity { get; set; } = string.Empty;
    public string ProposedSolution { get; set; } = string.Empty;
    public string StrategicObjective { get; set; } = string.Empty;
    public string InnovationCategory { get; set; } = string.Empty;
    public string SdgContribution { get; set; } = string.Empty;
    public string ExpectedBenefits { get; set; } = string.Empty;
    public string KeyEnablers { get; set; } = string.Empty;
    public string ImplementationApproach { get; set; } = string.Empty;
    public string ExpectedImpactIndicators { get; set; } = string.Empty;
    public string? PotentialRisks { get; set; }
    public string? Reviewer { get; set; }
    public string? ReviewDeadline { get; set; }
    public string ReviewSlaStatus { get; set; } = "On Track";
    public List<CommentDto> Comments { get; set; } = new();
    public List<AttachmentDto> Attachments { get; set; } = new();
    public List<ApprovalWorkflowStepDto> ApprovalWorkflow { get; set; } = new();
    public List<TimelineEntryDto> Timeline { get; set; } = new();
    public List<ProgressStageDto> ProgressStages { get; set; } = new();
}

public class IndividualDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? BusinessUnit { get; set; }
    public string? DutyStation { get; set; }
    public string? Age { get; set; }
    public string? Gender { get; set; }
    public string? JobRank { get; set; }
}

public class CommentDto
{
    public string Author { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

public class AttachmentDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public long Size { get; set; }
}

public class ApprovalWorkflowStepDto
{
    public string Step { get; set; } = string.Empty;
    public string Status { get; set; } = "Not Started";
}

public class TimelineEntryDto
{
    public string Stage { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
}

public class ProgressStageDto
{
    public string Name { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public bool Active { get; set; }
}
