# Check for Maven
if (!(Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: 'mvn' not found in PATH. Please ensure Apache Maven is installed and added to your System Environment PATH." -ForegroundColor Red
    Write-Host "Alternatively, you can run the Backend project from your IDE (IntelliJ/Eclipse/VS Code)." -ForegroundColor Yellow
} else {
    Write-Host "Starting Backend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; mvn spring-boot:run"
}

# Wait a bit for backend to initialize (optional but helpful)
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Blue
npm run dev
