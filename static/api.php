<?php
/**
 * Simple PHP Proxy to bypass CORS issues.
 * Supports JSON and Multipart/form-data (File Uploads)
 */

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
            }
        }
        return $headers;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$queryString = $_SERVER['QUERY_STRING'];
$path = '';
if (strpos($queryString, 'path=') === 0) {
    $path = substr($queryString, 5);
}

$url = 'http://backend:5000' . $path;
$headers = getallheaders();
$curlHeaders = array();

foreach ($headers as $key => $value) {
    $keyLower = strtolower($key);
    // Khi upload file, để cURL tự tạo Content-Type với boundary mới
    if ($keyLower !== 'host' && $keyLower !== 'connection' && $keyLower !== 'content-length' && $keyLower !== 'accept-encoding') {
        if ($keyLower === 'content-type' && strpos($value, 'multipart/form-data') !== false) {
            continue; 
        }
        $curlHeaders[] = "$key: $value";
    }
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeaders);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Xử lý Body
if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    $contentType = isset($headers['Content-Type']) ? $headers['Content-Type'] : '';
    
    if (strpos($contentType, 'multipart/form-data') !== false) {
        // Chuyển tiếp file upload
        $postData = $_POST;
        foreach ($_FILES as $key => $file) {
            if (is_array($file['tmp_name'])) {
                foreach ($file['tmp_name'] as $index => $tmpName) {
                    if (!empty($tmpName)) {
                        // Gửi nhiều file với cùng một field name (vd: images)
                        // PHP cURL hỗ trợ mảng này bằng cú pháp images[0], images[1]... nhưng phải khớp logic BE
                        $postData[$key . '[' . $index . ']'] = new CURLFile($tmpName, $file['type'][$index], $file['name'][$index]);
                    }
                }
            } else {
                $postData[$key] = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
            }
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    } else {
        // Chuyển tiếp JSON hoặc form bình thường
        $input = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    }
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$resContentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Lỗi Proxy: ' . curl_error($ch)]);
} else {
    http_response_code($httpCode);
    if ($resContentType) header("Content-Type: $resContentType");
    echo $response;
}
curl_close($ch);
?>
