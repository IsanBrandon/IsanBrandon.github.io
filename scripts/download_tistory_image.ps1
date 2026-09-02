param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][string]$Referer,
    [Parameter(Mandatory = $true)][string]$Destination
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$headers = @{
    Referer = $Referer
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
}

Invoke-WebRequest -Uri $Url -Headers $headers -OutFile $Destination -UseBasicParsing
