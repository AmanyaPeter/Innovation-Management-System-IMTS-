using System;
using System.Collections.Generic;

namespace Imts.Web.Services
{
    // Authentication Contracts
    public record LoginRequest(string Username, string Password);
    public record RefreshRequest(string RefreshToken);
    public record LogoutRequest(string RefreshToken);
    public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
    public record UserSessionInfo(string Username, string DisplayName, string Email, List<string> Roles);
    public record LoginResponse(string AccessToken, string RefreshToken, string ExpiresAtUtc, UserSessionInfo User);

    // User Profile Mapped DTO
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string AccountStatus { get; set; } = string.Empty;
        public string OnlineStatus { get; set; } = string.Empty;
        public string LastLogin { get; set; } = string.Empty;
        public List<string> Permissions { get; set; } = new();
        public string Avatar { get; set; } = string.Empty;
    }

    // Category Model
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    // Idea Models & DTOs
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
        public int Id { get; set; }
        public string Author { get; set; } = string.Empty;
        public string AuthorRole { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }

    public class AttachmentDto
    {
        public int Id { get; set; }
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
        public object? TeamComposition { get; set; }
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

    // Resources & Notifications Mocks
    public class ResourceItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string FileSize { get; set; } = string.Empty;
        public string LastUpdated { get; set; } = string.Empty;
    }

    public class NotificationItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class ActivityItem
    {
        public int Id { get; set; }
        public string User { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Module { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }
}
