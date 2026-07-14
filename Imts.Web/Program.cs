using Microsoft.AspNetCore.Authentication.Cookies;
using Imts.Web.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register HTTP context and BearerTokenHandler
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<BearerTokenHandler>();

// Register typed HTTP Clients pointing to Port 5000 (AuthService / API Gateway)
builder.Services.AddHttpClient<AuthApiClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5000");
}).AddHttpMessageHandler<BearerTokenHandler>();

builder.Services.AddHttpClient<IdeasApiClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5000");
}).AddHttpMessageHandler<BearerTokenHandler>();

// Configure Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.LogoutPath = "/Account/Logout";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromHours(2);
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
