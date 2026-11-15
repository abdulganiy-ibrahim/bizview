using BusinessManagementApi.Models;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controllers;

[ApiController]
[Route("api/users")]

public class UserController : ControllerBase
{
  private readonly UserService _userService;

  public UserController(UserService userService)
  {
    _userService = userService;
  }

  [HttpGet("me")]
  public async Task<IActionResult> GetCurrentUser()
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    var userData = await _userService.GetByIdAsync(user.Id);

    return Ok(userData);
  }
}