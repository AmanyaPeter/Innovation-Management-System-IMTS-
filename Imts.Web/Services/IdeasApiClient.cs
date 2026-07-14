using System.Net.Http.Json;

namespace Imts.Web.Services
{
    public class IdeasApiClient
    {
        private readonly HttpClient _client;

        public IdeasApiClient(HttpClient client)
        {
            _client = client;
        }

        public async Task<List<IdeaResponse>> GetIdeasAsync()
        {
            var response = await _client.GetAsync("/api/ideas");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<List<IdeaResponse>>() ?? new();
            }
            return new();
        }

        public async Task<List<IdeaResponse>> GetMyIdeasAsync()
        {
            var response = await _client.GetAsync("/api/ideas/mine");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<List<IdeaResponse>>() ?? new();
            }
            return new();
        }

        public async Task<IdeaResponse?> GetIdeaByIdAsync(int id)
        {
            var response = await _client.GetAsync($"/api/ideas/{id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<IdeaResponse>();
            }
            return null;
        }

        public async Task<IdeaResponse?> CreateIdeaAsync(IdeaCreateRequest request)
        {
            var response = await _client.PostAsJsonAsync("/api/ideas", request);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<IdeaResponse>();
            }
            return null;
        }

        public async Task<IdeaResponse?> UpdateIdeaAsync(int id, IdeaUpdateRequest request)
        {
            var response = await _client.PutAsJsonAsync($"/api/ideas/{id}", request);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<IdeaResponse>();
            }
            return null;
        }

        public async Task<bool> RetractIdeaAsync(int id)
        {
            var response = await _client.PostAsync($"/api/ideas/{id}/retract", null);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> CancelIdeaAsync(int id)
        {
            var response = await _client.PostAsync($"/api/ideas/{id}/cancel", null);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> ReviewIdeaAsync(int id, ReviewRequest request)
        {
            var response = await _client.PutAsJsonAsync($"/api/ideas/{id}/review", request);
            return response.IsSuccessStatusCode;
        }

        public async Task<List<CommentDto>> GetCommentsAsync(int id)
        {
            var response = await _client.GetAsync($"/api/ideas/{id}/comments");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<List<CommentDto>>() ?? new();
            }
            return new();
        }

        public async Task<CommentDto?> AddCommentAsync(int id, CommentCreateRequest request)
        {
            var response = await _client.PostAsJsonAsync($"/api/ideas/{id}/comments", request);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<CommentDto>();
            }
            return null;
        }

        public async Task<bool> AddAttachmentAsync(int id, string fileName, string fileType, byte[] fileData)
        {
            using var content = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(fileData);
            fileContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(fileType);
            content.Add(fileContent, "file", fileName);

            var response = await _client.PostAsync($"/api/ideas/{id}/attachments", content);
            return response.IsSuccessStatusCode;
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            var response = await _client.GetAsync("/api/categories");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<List<Category>>() ?? new();
            }
            return new();
        }

        public async Task<Category?> CreateCategoryAsync(Category category)
        {
            var response = await _client.PostAsJsonAsync("/api/categories", category);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Category>();
            }
            return null;
        }

        public async Task<Category?> UpdateCategoryAsync(int id, Category category)
        {
            var response = await _client.PutAsJsonAsync($"/api/categories/{id}", category);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Category>();
            }
            return null;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var response = await _client.DeleteAsync($"/api/categories/{id}");
            return response.IsSuccessStatusCode;
        }
    }
}
