
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file and restore dependencies
COPY ["backend/businessmanagementApi.csproj", "backend/"]
RUN dotnet restore "backend/businessmanagementApi.csproj"

# Copy remaining source code
COPY . .

# Publish application
WORKDIR /src/backend
RUN dotnet publish "businessmanagementApi.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

# Configure ASP.NET Core port
ENV ASPNETCORE_HTTP_PORTS=10000

EXPOSE 10000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "businessmanagementApi.dll"]
