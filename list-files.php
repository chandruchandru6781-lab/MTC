<?php
// Allow CORS for local development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$directory = 'file/';

// Check if directory exists
if (!is_dir($directory)) {
    echo json_encode(['error' => 'Directory not found']);
    exit;
}

$files = [];

// Get all files in the directory
$dir = opendir($directory);
if ($dir) {
    while (($file = readdir($dir)) !== false) {
        if ($file !== '.' && $file !== '..') {
            $filePath = $directory . $file;
            if (is_file($filePath)) {
                $files[] = [
                    'name' => $file,
                    'path' => $filePath,
                    'size' => filesize($filePath),
                    'modified' => filemtime($filePath)
                ];
            }
        }
    }
    closedir($dir);
}

// Sort by name
usort($files, function($a, $b) {
    return strcmp($a['name'], $b['name']);
});

echo json_encode($files);
?>
