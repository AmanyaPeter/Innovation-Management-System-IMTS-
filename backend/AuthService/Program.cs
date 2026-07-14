using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure port to 5000 to match Vite proxy target
builder.WebHost.UseUrls("http://localhost:5000");

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

// In-memory token stores for session tracking
var activeTokens = new ConcurrentDictionary<string, UserSessionInfo>();
var refreshToAccessTokens = new ConcurrentDictionary<string, string>();

// Path finder for users.json
string FindUsersJsonPath()
{
    var pathsToCheck = new[]
    {
        "data/users.json",
        "../data/users.json",
        "../../data/users.json",
        "../../../data/users.json",
        Path.Combine(AppContext.BaseDirectory, "data/users.json")
    };

    foreach (var path in pathsToCheck)
    {
        if (File.Exists(path))
        {
            return path;
        }
    }

    throw new FileNotFoundException("Could not find data/users.json in any of the expected locations.");
}

List<UserDto> LoadUsers()
{
    try
    {
        var path = FindUsersJsonPath();
        var json = File.ReadAllText(path);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Deserialize<List<UserDto>>(json, options) ?? new List<UserDto>();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error loading users: {ex.Message}");
        return new List<UserDto>();
    }
}

List<string> MapRoleToRoles(string role)
{
    if (role.Equals("Innovation Manager", StringComparison.OrdinalIgnoreCase) ||
        role.Equals("Innovation Officer", StringComparison.OrdinalIgnoreCase))
    {
        return new List<string> { "InnovationTeam" };
    }
    if (role.Equals("IT Admin", StringComparison.OrdinalIgnoreCase))
    {
        return new List<string> { "ITAdmin" };
    }
    if (role.Equals("Staff", StringComparison.OrdinalIgnoreCase))
    {
        return new List<string> { "Staff" };
    }
    return new List<string>();
}

// POST /api/auth/login
app.MapPost("/api/auth/login", (LoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.Json(new { error = "Invalid username or password." }, statusCode: 401);
    }

    var users = LoadUsers();
    var username = request.Username.Trim();

    var matchingUser = users.FirstOrDefault(u =>
        u.Email.Equals(username, StringComparison.OrdinalIgnoreCase) ||
        u.Email.Split('@')[0].Equals(username, StringComparison.OrdinalIgnoreCase) ||
        u.Name.Replace(" ", "").Equals(username, StringComparison.OrdinalIgnoreCase) ||
        (username.ToLower() == "jane" && u.Email.Equals("jane.mukasa@bou.or.ug", StringComparison.OrdinalIgnoreCase)) ||
        (username.ToLower() == "brian" && u.Email.Equals("brian@bou.or.ug", StringComparison.OrdinalIgnoreCase)) ||
        (username.ToLower() == "admin" && u.Email.Equals("admin@bou.or.ug", StringComparison.OrdinalIgnoreCase))
    );

    if (matchingUser == null)
    {
        return Results.Json(new { error = "Invalid username or password." }, statusCode: 401);
    }

    if (matchingUser.AccountStatus.Equals("Locked", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Json(new { error = "Your account is not provisioned for IMTS. Contact IT." }, statusCode: 403);
    }

    var roles = MapRoleToRoles(matchingUser.Role);
    if (roles.Count == 0)
    {
        return Results.Json(new { error = "Your account is not provisioned for IMTS. Contact IT." }, statusCode: 403);
    }

    var adUsername = matchingUser.Email.Split('@')[0].ToLower();
    var userSession = new UserSessionInfo(adUsername, matchingUser.Name, matchingUser.Email, roles);

    var accessToken = "access_" + Guid.NewGuid().ToString("N");
    var refreshToken = "refresh_" + Guid.NewGuid().ToString("N");
    var expiresAtUtc = DateTime.UtcNow.AddHours(2).ToString("yyyy-MM-ddTHH:mm:ssZ");

    activeTokens[accessToken] = userSession;
    refreshToAccessTokens[refreshToken] = accessToken;

    var response = new LoginResponse(accessToken, refreshToken, expiresAtUtc, userSession);
    return Results.Ok(response);
});

// POST /api/auth/refresh
app.MapPost("/api/auth/refresh", (RefreshRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.RefreshToken) || !refreshToAccessTokens.TryGetValue(request.RefreshToken, out var oldAccessToken))
    {
        return Results.Json(new { error = "Invalid or expired refresh token." }, statusCode: 401);
    }

    if (!activeTokens.TryRemove(oldAccessToken, out var userSession))
    {
        return Results.Json(new { error = "Invalid or expired refresh token." }, statusCode: 401);
    }

    refreshToAccessTokens.TryRemove(request.RefreshToken, out _);

    var newAccessToken = "access_" + Guid.NewGuid().ToString("N");
    var newRefreshToken = "refresh_" + Guid.NewGuid().ToString("N");
    var expiresAtUtc = DateTime.UtcNow.AddHours(2).ToString("yyyy-MM-ddTHH:mm:ssZ");

    activeTokens[newAccessToken] = userSession;
    refreshToAccessTokens[newRefreshToken] = newAccessToken;

    var response = new LoginResponse(newAccessToken, newRefreshToken, expiresAtUtc, userSession);
    return Results.Ok(response);
});

// POST /api/auth/logout
app.MapPost("/api/auth/logout", (HttpContext context, LogoutRequest request) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    string? accessToken = null;
    if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        accessToken = authHeader.Substring("Bearer ".Length).Trim();
    }

    if (!string.IsNullOrEmpty(accessToken))
    {
        activeTokens.TryRemove(accessToken, out _);
    }

    if (!string.IsNullOrWhiteSpace(request.RefreshToken))
    {
        if (refreshToAccessTokens.TryRemove(request.RefreshToken, out var associatedAccessToken))
        {
            activeTokens.TryRemove(associatedAccessToken, out _);
        }
    }

    return Results.NoContent();
});

// GET /api/auth/me
app.MapGet("/api/auth/me", (HttpContext context) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);
    }

    var token = authHeader.Substring("Bearer ".Length).Trim();
    if (!activeTokens.TryGetValue(token, out var userSession))
    {
        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);
    }

    return Results.Ok(userSession);
});

// POST /api/auth/change-password
app.MapPost("/api/auth/change-password", (HttpContext context, ChangePasswordRequest request) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);
    }

    var token = authHeader.Substring("Bearer ".Length).Trim();
    if (!activeTokens.TryGetValue(token, out _))
    {
        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);
    }

    if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
    {
        return Results.BadRequest(new { error = "Password fields cannot be empty." });
    }

    // In a real LDAP implementation, this would write back to Active Directory.
    // For now, it succeeds as per the mock requirement.
    return Results.NoContent();
});

// ITAdmin endpoints placeholder
app.MapGet("/api/users", (HttpContext context) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)) return Results.Json(new { error = "Unauthorized" }, statusCode: 401);
    var token = authHeader.Substring("Bearer ".Length).Trim();
    if (!activeTokens.TryGetValue(token, out var session) || !session.Roles.Contains("ITAdmin")) return Results.Json(new { error = "Forbidden" }, statusCode: 403);

    var users = LoadUsers();
    return Results.Ok(users);
});

// Lightweight API Gateway Proxy forwarding `/api/ideas` and `/api/categories` to Port 5002
app.Map("/api/ideas", async (HttpContext context) =>
{
    var targetUri = new Uri("http://localhost:5002" + context.Request.Path + context.Request.QueryString);
    await ProxyRequest(context, targetUri);
});

app.Map("/api/categories", async (HttpContext context) =>
{
    var targetUri = new Uri("http://localhost:5002" + context.Request.Path + context.Request.QueryString);
    await ProxyRequest(context, targetUri);
});

async Task ProxyRequest(HttpContext context, Uri targetUri)
{
    using var client = new HttpClient();
    var request = new HttpRequestMessage(new HttpMethod(context.Request.Method), targetUri);

    if (context.Request.ContentLength > 0)
    {
        request.Content = new StreamContent(context.Request.Body);
        request.Content.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(context.Request.ContentType ?? "application/json");
    }

    foreach (var header in context.Request.Headers)
    {
        if (header.Key.Equals("Host", StringComparison.OrdinalIgnoreCase)) continue;
        request.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
    }

    var response = await client.SendAsync(request);
    context.Response.StatusCode = (int)response.StatusCode;

    foreach (var header in response.Headers)
    {
        if (header.Key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase)) continue;
        if (header.Key.Equals("Connection", StringComparison.OrdinalIgnoreCase)) continue;
        context.Response.Headers[header.Key] = header.Value.ToArray();
    }
    foreach (var header in response.Content.Headers)
    {
        if (header.Key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase)) continue;
        context.Response.Headers[header.Key] = header.Value.ToArray();
    }

    await response.Content.CopyToAsync(context.Response.Body);
}

app.Run();

// Data contract DTOs
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

public record LoginRequest(string Username, string Password);
public record RefreshRequest(string RefreshToken);
public record LogoutRequest(string RefreshToken);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public record UserSessionInfo(string Username, string DisplayName, string Email, List<string> Roles);
public record LoginResponse(string AccessToken, string RefreshToken, string ExpiresAtUtc, UserSessionInfo User);
