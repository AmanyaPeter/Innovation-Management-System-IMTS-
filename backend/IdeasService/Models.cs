using System;
using System.Collections.Generic;

namespace IdeasService.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class Idea
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Category name (e.g., "FinTech")
        public string Department { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty; // "Submitted", "Concept Development", "Experimentation", "Deployment", "Closed"
        public string Status { get; set; } = string.Empty; // "Submitted", "Under Review", "Approved", "Declined", "Retracted", "Cancelled", "Pending Information"
        public string DateSubmitted { get; set; } = string.Empty; // ISO string
        public string LastUpdated { get; set; } = string.Empty; // ISO string
        public string SubmitterName { get; set; } = string.Empty;
        public string SubmitterEmail { get; set; } = string.Empty;
        public string SubmissionType { get; set; } = "individual"; // "individual" or "team"

        // Individual details
        public string? IndividualFullName { get; set; }
        public string? IndividualEmail { get; set; }
        public string? IndividualBusinessUnit { get; set; }
        public string? IndividualDutyStation { get; set; }
        public string? IndividualAge { get; set; }
        public string? IndividualGender { get; set; }
        public string? IndividualJobRank { get; set; }

        // Team composition (stored as JSON in DB)
        public string? TeamCompositionJson { get; set; }

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

        public bool IsLocked { get; set; } = false;
        public DateTime StageEnteredAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public List<Comment> Comments { get; set; } = new();
        public List<Attachment> Attachments { get; set; } = new();
        public List<ApprovalWorkflowStep> ApprovalWorkflow { get; set; } = new();
        public List<TimelineEntry> Timeline { get; set; } = new();
    }

    public class Comment
    {
        public int Id { get; set; }
        public int IdeaId { get; set; }
        public string Author { get; set; } = string.Empty;
        public string AuthorRole { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty; // ISO string
        public string Text { get; set; } = string.Empty;
    }

    public class Attachment
    {
        public int Id { get; set; }
        public int IdeaId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public long Size { get; set; }
        public string? StoragePath { get; set; }
    }

    public class ApprovalWorkflowStep
    {
        public int Id { get; set; }
        public int IdeaId { get; set; }
        public string Step { get; set; } = string.Empty; // "Initial Review", "Manager Approval", "DDIPS Review", "Final Approval"
        public string Status { get; set; } = "Not Started"; // "Complete", "Pending", "Not Started", "Declined"
    }

    public class TimelineEntry
    {
        public int Id { get; set; }
        public int IdeaId { get; set; }
        public string Stage { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty; // YYYY-MM-DD
    }

    public class StageHistory
    {
        public int Id { get; set; }
        public int IdeaId { get; set; }
        public string FromStage { get; set; } = string.Empty;
        public string ToStage { get; set; } = string.Empty;
        public string FromStatus { get; set; } = string.Empty;
        public string ToStatus { get; set; } = string.Empty;
        public string ChangedByUsername { get; set; } = string.Empty;
        public string? Note { get; set; }
        public DateTime ChangedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
