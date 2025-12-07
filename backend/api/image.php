<?php

// We need this so frontend can access the image
header("Access-Control-Allow-Origin: *");

// Taking filename from string query
$filename = $_GET['file'] ?? null;

// If the filename isn't exist
if (!$filename) {
    http_response_code(400);
    echo "No file specified";
    exit;
}

// Security: prevent directory traversal
if (strpos($filename, '..') !== false || strpos($filename, '/') !== false) {
    http_response_code(403);
    echo "Invalid filename";
    exit;
}

// Finding the image in uploads folder
$filepath = __DIR__ . "/../uploads/" . $filename;

// If the image isn't found
if (!file_exists($filepath)) {
    error_log("Image not found: " . $filepath);
    http_response_code(404);
    echo "File not found: " . $filename;
    exit;
}

// Telling the browser about file type
$ext = pathinfo($filepath, PATHINFO_EXTENSION);
$mimeTypes = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp'
];

$mimeType = $mimeTypes[strtolower($ext)] ?? 'application/octet-stream';

// Sending it to the browser
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: public, max-age=86400');

readfile($filepath);
?>