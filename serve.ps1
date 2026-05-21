$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Listening on http://localhost:$port/ and http://127.0.0.1:$port/"
$basePath = "c:\Users\HP\Downloads\phoenix-waterproofing-services 2\phoenix-waterproofing-services\dist"

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $url = $request.Url.LocalPath
            if ($url -eq "/") {
                $url = "/index.html"
            }

            # Normalize file path
            $filePath = Join-Path $basePath $url.Replace('/', '\')
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                # Determine Content-Type
                $ext = [System.IO.Path]::GetExtension($filePath)
                $contentType = "text/plain"
                switch ($ext) {
                    ".html" { $contentType = "text/html" }
                    ".css"  { $contentType = "text/css" }
                    ".js"   { $contentType = "application/javascript" }
                    ".png"  { $contentType = "image/png" }
                    ".jpg"  { $contentType = "image/jpeg" }
                    ".jpeg" { $contentType = "image/jpeg" }
                    ".svg"  { $contentType = "image/svg+xml" }
                    ".ico"  { $contentType = "image/x-icon" }
                }
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                # For client-side routing, serve index.html if the file is not found
                $indexPath = Join-Path $basePath "index.html"
                if (Test-Path $indexPath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($indexPath)
                    $response.ContentType = "text/html"
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $response.StatusCode = 404
                }
            }
            $response.Close()
        } catch {
            Write-Warning "Request Error: $_"
            if ($null -ne $response) {
                try { $response.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
}
