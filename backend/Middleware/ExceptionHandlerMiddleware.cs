using Microsoft.AspNetCore.Diagnostics;

namespace BusinessManagementApi.Middleware;

public class ExceptionHandlerMiddleware : IExceptionHandler
{
  public async ValueTask<bool> TryHandleAsync(
    HttpContext context,
    Exception exception,
    CancellationToken cancellationToken)
  {
    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
    context.Response.ContentType = "application/json";

    var errorResponse = new
    {
        message = "An unexpected error occurred."
    };

    var json = System.Text.Json.JsonSerializer.Serialize(errorResponse);

    await context.Response.WriteAsync(json, cancellationToken);

    return true;
  }
}