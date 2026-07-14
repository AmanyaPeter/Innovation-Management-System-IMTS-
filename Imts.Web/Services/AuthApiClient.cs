using System.Net.Http.Json;

namespace Imts.Web.Services
{
    public class AuthApiClient
    {
        private readonly HttpClient _client;

        public AuthApiClient(HttpClient client)
        {
            _client = client;
        }

        public async Task<LoginResponse?> LoginAsync(string username, string password)
        {
            var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(username, password));
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<LoginResponse>();
            }
            return null;
        }

        public async Task LogoutAsync(string refreshToken)
        {
            await _client.PostAsJsonAsync("/api/auth/logout", new LogoutRequest(refreshToken));
        }

        public async Task<bool> ChangePasswordAsync(string currentPassword, string newPassword)
        {
            var response = await _client.PostAsJsonAsync("/api/auth/change-password", new ChangePasswordRequest(currentPassword, newPassword));
            return response.IsSuccessStatusCode;
        }

        public async Task<List<UserDto>> GetUsersAsync()
        {
            var response = await _client.GetAsync("/api/users");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<List<UserDto>>() ?? new();
            }
            return new();
        }
    }
}
