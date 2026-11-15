using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Services;

public class UserService
{
  private readonly UserRepository _userRepository;

  public UserService(UserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  public async Task<UserRecord?> GetByIdAsync(Guid userId)
  {
    var user = await _userRepository.GetByIdAsync(userId);

    return user;
  } 
}