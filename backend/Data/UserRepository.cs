using Npgsql;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class UserRepository
{
  private readonly string _connectionString;

  public UserRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  public async Task<UserRecord?> GetByIdAsync(Guid id)
  {
    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(
        """
        SELECT
          id,
          email,
          display_name,
          phone,
          created_at,
          last_sign_in
        FROM public.users
        WHERE id = @id
        """,
        conn);

    cmd.Parameters.AddWithValue("id", id);

    await using var reader = await cmd.ExecuteReaderAsync();

    if (await reader.ReadAsync())
    {
      return new UserRecord(
        reader.GetGuid(0),
        reader.GetString(1),
        reader.GetString(2),
        reader.IsDBNull(3) ? null : reader.GetString(3),
        reader.GetDateTime(4),
        reader.GetDateTime(5)
      );
    }

    return null;
  }
}