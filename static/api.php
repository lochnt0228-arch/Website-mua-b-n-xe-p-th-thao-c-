<?php
/**
 * Simple PHP Proxy to bypass CORS issues.
 * Forwards requests from the frontend to the internal node backend container.
 */

// Handle preflight OPTIONS requests directly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            } else if ($name == "CONTENT_TYPE") {
                $headers["Content-Type"] = $value;
            } else if ($name == "CONTENT_LENGTH") {
                $headers["Content-Length"] = $value;
            }
        }
        return $headers;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// Parse query string manually to preserve parameters after the ? in the path
$queryString = $_SERVER['QUERY_STRING'];
$path = '';
if (strpos($queryString, 'path=') === 0) {
    $path = substr($queryString, 5); // Extract everything after 'path='
}

// Proxy to the internal Docker backend container on port 5000
$url = 'http://backend:5000' . $path;

$headers = getallheaders();
$curlHeaders = array();

// Forward relevant headers
foreach ($headers as $key => $value) {
    $keyLower = strtolower($key);
    // Ignore these headers as cURL handles them automatically
    if ($keyLower !== 'host' && $keyLower !== 'connection' && $keyLower !== 'content-length' && $keyLower !== 'accept-encoding') {
        $curlHeaders[] = "$key: $value";
    }
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeaders);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Forward request body
if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    $input = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi Proxy: Không thể kết nối tới backend (' . curl_error($ch) . ')'
    ]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// Set the response code and content type to match the backend's response
http_response_code($httpCode);
if ($contentType) {
    header("Content-Type: $contentType");
}

echo $response;
?>
