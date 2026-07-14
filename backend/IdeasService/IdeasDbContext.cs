using System;
using System.IO;
using System.Collections.Generic;
using System.Text.Json;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using IdeasService.Models;

namespace IdeasService
{
    public class IdeasDbContext : DbContext
    {
        public IdeasDbContext(DbContextOptions<IdeasDbContext> options) : base(options)
        {
        }

        public DbSet<Idea> Ideas => Set<Idea>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Attachment> Attachments => Set<Attachment>();
        public DbSet<ApprovalWorkflowStep> ApprovalWorkflowSteps => Set<ApprovalWorkflowStep>();
        public DbSet<TimelineEntry> TimelineEntries => Set<TimelineEntry>();
        public DbSet<StageHistory> StageHistories => Set<StageHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Idea>().HasMany(i => i.Comments).WithOne().HasForeignKey(c => c.IdeaId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Idea>().HasMany(i => i.Attachments).WithOne().HasForeignKey(a => a.IdeaId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Idea>().HasMany(i => i.ApprovalWorkflow).WithOne().HasForeignKey(w => w.IdeaId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Idea>().HasMany(i => i.Timeline).WithOne().HasForeignKey(t => t.IdeaId).OnDelete(DeleteBehavior.Cascade);
        }

        public static void SeedDatabase(IdeasDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Categories.Any())
            {
                var categoriesPath = FindDataFilePath("categories.json");
                var categoriesJson = File.ReadAllText(categoriesPath);
                var rawCategories = JsonSerializer.Deserialize<List<RawCategory>>(categoriesJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (rawCategories != null)
                {
                    foreach (var rc in rawCategories)
                    {
                        context.Categories.Add(new Category
                        {
                            Id = rc.Id,
                            Name = rc.Name,
                            Description = rc.Description,
                            IsActive = rc.Status?.Equals("Active", StringComparison.OrdinalIgnoreCase) ?? true
                        });
                    }
                    context.SaveChanges();
                }
            }

            if (!context.Ideas.Any())
            {
                var ideasPath = FindDataFilePath("ideas.json");
                var ideasJson = File.ReadAllText(ideasPath);
                var rawIdeas = JsonSerializer.Deserialize<List<RawIdea>>(ideasJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (rawIdeas != null)
                {
                    foreach (var ri in rawIdeas)
                    {
                        var idea = new Idea
                        {
                            Id = ri.Id,
                            Title = ri.Title ?? string.Empty,
                            Category = ri.Category ?? string.Empty,
                            Department = ri.Department ?? string.Empty,
                            Stage = ri.Stage ?? string.Empty,
                            Status = ri.Status ?? string.Empty,
                            DateSubmitted = ri.DateSubmitted ?? string.Empty,
                            LastUpdated = ri.LastUpdated ?? string.Empty,
                            SubmitterName = ri.SubmitterName ?? string.Empty,
                            SubmitterEmail = ri.SubmitterEmail ?? string.Empty,
                            SubmissionType = ri.SubmissionType ?? "individual",
                            ExecutiveSummary = ri.ExecutiveSummary ?? string.Empty,
                            ProblemOrOpportunity = ri.ProblemOrOpportunity ?? string.Empty,
                            ProposedSolution = ri.ProposedSolution ?? string.Empty,
                            StrategicObjective = ri.StrategicObjective ?? string.Empty,
                            InnovationCategory = ri.InnovationCategory ?? string.Empty,
                            SdgContribution = ri.SdgContribution ?? string.Empty,
                            ExpectedBenefits = ri.ExpectedBenefits ?? string.Empty,
                            KeyEnablers = ri.KeyEnablers ?? string.Empty,
                            ImplementationApproach = ri.ImplementationApproach ?? string.Empty,
                            ExpectedImpactIndicators = ri.ExpectedImpactIndicators ?? string.Empty,
                            PotentialRisks = ri.PotentialRisks,
                            Reviewer = ri.Reviewer,
                            ReviewDeadline = ri.ReviewDeadline,
                            ReviewSlaStatus = ri.ReviewSlaStatus ?? "On Track",
                            IsLocked = ri.Status?.Equals("Under Review", StringComparison.OrdinalIgnoreCase) == true,
                            StageEnteredAtUtc = DateTime.UtcNow,
                            CreatedAtUtc = DateTime.UtcNow
                        };

                        if (ri.Individual != null)
                        {
                            idea.IndividualFullName = ri.Individual.FullName;
                            idea.IndividualEmail = ri.Individual.Email;
                            idea.IndividualBusinessUnit = ri.Individual.BusinessUnit;
                            idea.IndividualDutyStation = ri.Individual.DutyStation;
                            idea.IndividualAge = ri.Individual.Age;
                            idea.IndividualGender = ri.Individual.Gender;
                            idea.IndividualJobRank = ri.Individual.JobRank;
                        }

                        if (ri.TeamComposition != null)
                        {
                            idea.TeamCompositionJson = JsonSerializer.Serialize(ri.TeamComposition);
                        }

                        if (ri.Comments != null)
                        {
                            idea.Comments = ri.Comments.Select(c => new Comment
                            {
                                Author = c.Author ?? string.Empty,
                                AuthorRole = c.AuthorRole ?? string.Empty,
                                Timestamp = c.Timestamp ?? string.Empty,
                                Text = c.Text ?? string.Empty
                            }).ToList();
                        }

                        if (ri.Attachments != null)
                        {
                            idea.Attachments = ri.Attachments.Select(a => new Attachment
                            {
                                Name = a.Name ?? string.Empty,
                                Type = a.Type ?? string.Empty,
                                Size = a.Size
                            }).ToList();
                        }

                        if (ri.ApprovalWorkflow != null)
                        {
                            idea.ApprovalWorkflow = ri.ApprovalWorkflow.Select(w => new ApprovalWorkflowStep
                            {
                                Step = w.Step ?? string.Empty,
                                Status = w.Status ?? "Not Started"
                            }).ToList();
                        }

                        if (ri.Timeline != null)
                        {
                            idea.Timeline = ri.Timeline.Select(t => new TimelineEntry
                            {
                                Stage = t.Stage ?? string.Empty,
                                Date = t.Date ?? string.Empty
                            }).ToList();
                        }

                        context.Ideas.Add(idea);
                    }
                    context.SaveChanges();
                }
            }
        }

        private static string FindDataFilePath(string filename)
        {
            var pathsToCheck = new[]
            {
                $"data/{filename}",
                $"../data/{filename}",
                $"../../data/{filename}",
                $"../../../data/{filename}",
                Path.Combine(AppContext.BaseDirectory, $"data/{filename}")
            };

            foreach (var path in pathsToCheck)
            {
                if (File.Exists(path))
                {
                    return path;
                }
            }

            throw new FileNotFoundException($"Could not find data/{filename} in any of the expected locations.");
        }

        // Intermediate mapping DTOs for deserialization
        private class RawCategory
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? Status { get; set; }
        }

        private class RawIdea
        {
            public int Id { get; set; }
            public string? Title { get; set; }
            public string? Category { get; set; }
            public string? Department { get; set; }
            public string? Stage { get; set; }
            public string? Status { get; set; }
            public string? DateSubmitted { get; set; }
            public string? LastUpdated { get; set; }
            public string? SubmitterName { get; set; }
            public string? SubmitterEmail { get; set; }
            public string? SubmissionType { get; set; }
            public RawIndividual? Individual { get; set; }
            public object? TeamComposition { get; set; }
            public string? ExecutiveSummary { get; set; }
            public string? ProblemOrOpportunity { get; set; }
            public string? ProposedSolution { get; set; }
            public string? StrategicObjective { get; set; }
            public string? InnovationCategory { get; set; }
            public string? SdgContribution { get; set; }
            public string? ExpectedBenefits { get; set; }
            public string? KeyEnablers { get; set; }
            public string? ImplementationApproach { get; set; }
            public string? ExpectedImpactIndicators { get; set; }
            public string? PotentialRisks { get; set; }
            public string? Reviewer { get; set; }
            public string? ReviewDeadline { get; set; }
            public string? ReviewSlaStatus { get; set; }
            public List<RawWorkflow>? ApprovalWorkflow { get; set; }
            public List<RawComment>? Comments { get; set; }
            public List<RawAttachment>? Attachments { get; set; }
            public List<RawTimeline>? Timeline { get; set; }
        }

        private class RawIndividual
        {
            public string? FullName { get; set; }
            public string? Email { get; set; }
            public string? BusinessUnit { get; set; }
            public string? DutyStation { get; set; }
            public string? Age { get; set; }
            public string? Gender { get; set; }
            public string? JobRank { get; set; }
        }

        private class RawComment
        {
            public string? Author { get; set; }
            public string? AuthorRole { get; set; }
            public string? Timestamp { get; set; }
            public string? Text { get; set; }
        }

        private class RawAttachment
        {
            public string? Name { get; set; }
            public string? Type { get; set; }
            public long Size { get; set; }
        }

        private class RawWorkflow
        {
            public string? Step { get; set; }
            public string? Status { get; set; }
        }

        private class RawTimeline
        {
            public string? Stage { get; set; }
            public string? Date { get; set; }
        }
    }
}
